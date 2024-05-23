# Wordgame Database - README

## Overview
This document provides an overview of the SQL procedures, functions, and table structures for the `wordgame` database. The database manages word game functionalities including user login, word selection, scoring, and timer management.

## Database Schema
The database consists of several tables, stored procedures, and functions, which work together to manage the word game operations.

### Tables
1. **admin**: Stores administrator information.
2. **answers**: Stores user-submitted answers.
3. **counter_table**: Maintains a counter for interval time.
4. **loginhistory**: Logs user login history.
5. **random**: Stores randomly selected words for the game.
6. **resulthistory**: Records the history of game results.
7. **time**: Stores predefined interval times.
8. **timerend**: Stores timer end times for players.
9. **wordlimit**: Maintains word limits for the game.
10. **words**: Stores words along with their translations and other details.

### Views
- **report_view**: Aggregates player scores and calculates score percentages.

## Stored Procedures
The database contains several stored procedures for managing game logic, user interactions, and scoring.

### 1. `add_random_words`
Populates the `random` table with a limited number of randomly selected words from the `words` table.
```sql
CREATE DEFINER=`root`@`localhost` PROCEDURE `add_random_words` ()
BEGIN
    DECLARE word_limit INT;
    SET word_limit = (SELECT get_latest_word_limit());
    TRUNCATE TABLE random;
    INSERT INTO random (id, english, turkish, sentence, image)
    SELECT id, english, turkish, sentence, image
    FROM words
    ORDER BY RAND()
    LIMIT word_limit;
END;
```

### 2. `check_time`
Checks if the current time has passed the `timeEND` for the latest player.
```sql
CREATE DEFINER=`root`@`localhost` PROCEDURE `check_time` ()
BEGIN
    SELECT 
        CASE 
            WHEN NOW() >= (SELECT timeEND FROM timerend WHERE playerID = (SELECT get_latest_player_id()) ORDER BY timerID DESC LIMIT 1)
            THEN 1 
            ELSE 0 
        END AS time_result;
END;
```

### 3. `delete_first_row`
Deletes the first row from the `random` table.
```sql
CREATE DEFINER=`root`@`localhost` PROCEDURE `delete_first_row` ()
BEGIN
    DELETE FROM random
    ORDER BY id ASC
    LIMIT 1;
END;
```

### 4. `insert_result_history`
Inserts a new entry into `resulthistory` with the latest player's ID, current date, time, and score.
```sql
CREATE DEFINER=`root`@`localhost` PROCEDURE `insert_result_history` ()
BEGIN
    INSERT INTO resulthistory(loginID, date, time, score)
    VALUES((SELECT get_latest_player_id()), CURDATE(), CURTIME(), (SELECT right_answer()));
END;
```

### 5. `insert_timerend`
Sets a timer end time for the latest player by adding an interval to the current time.
```sql
CREATE DEFINER=`root`@`localhost` PROCEDURE `insert_timerend` ()
BEGIN
    DECLARE latest_player_id INT;
    DECLARE interval_time TIME;
    DECLARE current_time_var TIME;
    SET latest_player_id = (SELECT get_latest_player_id());
    SET interval_time = (SELECT get_interval_time());
    SET current_time_var = CURTIME();
    INSERT INTO timerend(playerID, timeEND)
    VALUES (latest_player_id, ADDTIME(current_time_var, interval_time));
END;
```

### 6. `insert_timerend_part2`
Inserts the current time as `timeEND` for the latest player.
```sql
CREATE DEFINER=`root`@`localhost` PROCEDURE `insert_timerend_part2` ()
BEGIN
    DECLARE latest_player_id INT;
    DECLARE current_time_var TIME;
    SET latest_player_id = (SELECT get_latest_player_id());
    SET current_time_var = CURTIME();
    INSERT INTO timerend(playerID, timeEND)
    VALUES (latest_player_id, current_time_var);
END;
```

## Functions
The database includes functions that perform specific calculations and return values used by the stored procedures.

### 1. `calculate_timediff`
Calculates the time difference between `timeEND` and the current time.
```sql
CREATE DEFINER=`root`@`localhost` FUNCTION `calculate_timediff` () RETURNS TIME
BEGIN
    DECLARE diff TIME;
    SELECT TIMEDIFF(timeEND, CURTIME()) 
    INTO diff 
    FROM timerend 
    WHERE playerID = (SELECT get_latest_player_id()) 
    ORDER BY timerID DESC 
    LIMIT 1;
    RETURN diff;
END;
```

### 2. `get_interval_time`
Returns the interval time based on the current counter value and updates the counter.
```sql
CREATE DEFINER=`root`@`localhost` FUNCTION `get_interval_time` () RETURNS TIME
BEGIN
    DECLARE intervalT TIME;
    DECLARE current_counter INT;
    SELECT counter INTO current_counter FROM counter_table ORDER BY id DESC LIMIT 1;
    SELECT intervalTime INTO intervalT FROM time WHERE id = current_counter LIMIT 1;
    IF current_counter < 6 THEN
        SET current_counter = current_counter + 1;
    ELSE
        SET current_counter = 1;
    END IF;
    UPDATE counter_table SET counter = current_counter;
    RETURN intervalT;
END;
```

### 3. `get_latest_player_id`
Returns the ID of the latest player from the `loginhistory` table.
```sql
CREATE DEFINER=`root`@`localhost` FUNCTION `get_latest_player_id` () RETURNS INT
BEGIN
    DECLARE latestName VARCHAR(255);
    DECLARE latestID INT;
    SELECT lh.name INTO latestName FROM loginhistory lh ORDER BY lh.id DESC LIMIT 1;
    SELECT a.id INTO latestID FROM admin a WHERE a.name = latestName LIMIT 1;
    RETURN latestID;
END;
```

### 4. `get_latest_word_limit`
Returns the latest word limit from the `wordlimit` table.
```sql
CREATE DEFINER=`root`@`localhost` FUNCTION `get_latest_word_limit` () RETURNS INT
BEGIN
    DECLARE latestLimit INT;
    SELECT newLimit INTO latestLimit FROM wordlimit ORDER BY limitID DESC LIMIT 1;
    RETURN latestLimit;
END;
```

### 5. `right_answer`
Counts the number of correct answers by comparing user answers with the `words` table.
```sql
CREATE DEFINER=`root`@`localhost` FUNCTION `right_answer` () RETURNS INT
BEGIN
    DECLARE common_count INT;
    SELECT COUNT(*) INTO common_count FROM answers a JOIN words w ON a.turkish = w.turkish;
    RETURN common_count;
END;
```

## Triggers
- **after_insert_loginhistory**: Calls the `insert_timerend_part2` procedure after a new record is inserted into `loginhistory`.
```sql
DELIMITER $$
CREATE TRIGGER `after_insert_loginhistory` AFTER INSERT ON `loginhistory` FOR EACH ROW 
BEGIN
    CALL insert_timerend_part2();
END
$$
DELIMITER ;
```

## How to Use
1. **Setup Database**: Import the SQL dump into your MariaDB database server.
2. **Add Words**: Populate the `words` table with the words you want to use in the game.
3. **Manage Users**: Use the `admin` table to manage game administrators.
4. **Play Game**: The game logic will handle word selection, timing, and scoring using the stored procedures and functions defined above.
5. **Review Results**: Use the `report_view` to generate reports on player performance.
