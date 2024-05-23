-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 22, 2024 at 08:37 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `wordgame`
--

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `add_random_words` ()   BEGIN
    DECLARE word_limit INT;
    
    -- Get the latest word limit
    SET word_limit = (SELECT get_latest_word_limit());
    
    -- Delete old words from the random table
    TRUNCATE TABLE random;
    
    -- Insert random rows of words from the words table
    INSERT INTO random (id, english, turkish, sentence, image)
    SELECT id, english, turkish, sentence, image
    FROM words
    ORDER BY RAND()
    LIMIT word_limit;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `check_time` ()   BEGIN
    SELECT 
        CASE 
            WHEN NOW() >= (SELECT timeEND FROM timerend WHERE playerID = (SELECT get_latest_player_id()) ORDER BY timerID DESC LIMIT 1)
            THEN 1 
            ELSE 0 
        END AS time_result;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `delete_first_row` ()   BEGIN
    DELETE FROM random
    ORDER BY id ASC
    LIMIT 1;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `insert_result_history` ()   BEGIN
    INSERT INTO resulthistory(loginID, date, time, score)
    VALUES((SELECT get_latest_player_id()), CURDATE(), CURTIME(), (SELECT right_answer()));
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `insert_timerend` ()   BEGIN
    DECLARE latest_player_id INT;
    DECLARE interval_time TIME;
    DECLARE current_time_var TIME;

    -- Get the latest player ID
    SET latest_player_id = (SELECT get_latest_player_id());

    -- Get the interval time
    SET interval_time = (SELECT get_interval_time());

    -- Get the current time
    SET current_time_var = CURTIME();

    -- Insert into timerend
    INSERT INTO timerend(playerID, timeEND)
    VALUES (latest_player_id, ADDTIME(current_time_var, interval_time));
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `insert_timerend_part2` ()   BEGIN
    DECLARE latest_player_id INT;
    DECLARE interval_time TIME;
    DECLARE current_time_var TIME;

    -- Get the latest player ID
    SET latest_player_id = (SELECT get_latest_player_id());

    -- Get the current time
    SET current_time_var = CURTIME();

    -- Insert into timerend
    INSERT INTO timerend(playerID, timeEND)
    VALUES (latest_player_id, current_time_var);
END$$

--
-- Functions
--
CREATE DEFINER=`root`@`localhost` FUNCTION `calculate_timediff` () RETURNS TIME  BEGIN
    DECLARE diff TIME;
    SELECT TIMEDIFF(timeEND, CURTIME()) 
    INTO diff 
    FROM timerend 
    WHERE playerID = (SELECT get_latest_player_id()) 
    ORDER BY timerID DESC 
    LIMIT 1;
    RETURN diff;
END$$

CREATE DEFINER=`root`@`localhost` FUNCTION `get_interval_time` () RETURNS TIME  BEGIN
    DECLARE intervalT TIME;
    DECLARE current_counter INT;

    -- Get the current value of the counter
    SELECT counter
    INTO current_counter
    FROM counter_table
    ORDER BY id DESC
    LIMIT 1;

    -- Get intervalTime based on id
    SELECT intervalTime
    INTO intervalT
    FROM time
    WHERE id = current_counter
    LIMIT 1; -- Limit the result to one row

    -- Increment counter to next (max 6, after that it will be 1)
    IF current_counter < 6 THEN
        SET current_counter = current_counter + 1;
    ELSE
        SET current_counter = 1;
    END IF;

    -- Update the counter in the table
    UPDATE counter_table
    SET counter = current_counter;

    RETURN intervalT;
END$$

CREATE DEFINER=`root`@`localhost` FUNCTION `get_latest_player_id` () RETURNS INT(11)  BEGIN
    DECLARE latestName VARCHAR(255);
    DECLARE latestID INT;

    -- Get the latest name from loginhistory
    SELECT lh.name INTO latestName
    FROM loginhistory lh
    ORDER BY lh.id DESC
    LIMIT 1;

    -- Get the player ID with the latest name
    SELECT a.id INTO latestID
    FROM admin a
    WHERE a.name = latestName
    LIMIT 1;

    RETURN latestID;
END$$

CREATE DEFINER=`root`@`localhost` FUNCTION `get_latest_word_limit` () RETURNS INT(11) DETERMINISTIC BEGIN
    DECLARE latestLimit INT;
    
    SELECT newLimit
    INTO latestLimit
    FROM wordlimit
    ORDER BY limitID DESC
    LIMIT 1;
    
    RETURN latestLimit;
END$$

CREATE DEFINER=`root`@`localhost` FUNCTION `right_answer` () RETURNS INT(11)  BEGIN
    DECLARE common_count INT;

    SELECT COUNT(*)
    INTO common_count
    FROM answers a
    JOIN words w ON a.turkish = w.turkish;

    RETURN common_count;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `id` int(11) NOT NULL,
  `name` varchar(20) NOT NULL,
  `surname` varchar(20) NOT NULL,
  `age` int(11) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`id`, `name`, `surname`, `age`, `email`, `password`) VALUES
(1, 'Toimur', 'Hasan', 22, 'toimur@gmail.com', '123000'),
(2, 'Ebrar Serra', 'Baysal', 21, 'serra@gmail.com', '123000'),
(3, 'Usaid', 'Alhadeethi', 20, 'usaidahmed40@gmail.com', '123000'),
(4, 'Soheyb', 'Boutadjine', 22, 'soheyb@gmail.com', '123000'),
(5, 'Example', '', 22, 'example@gmail.com', '123000');

-- --------------------------------------------------------

--
-- Table structure for table `answers`
--

CREATE TABLE `answers` (
  `id` int(11) NOT NULL,
  `turkish` varchar(20) NOT NULL,
  `sentence` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `answers`
--

INSERT INTO `answers` (`id`, `turkish`, `sentence`) VALUES
(163, 'elma', 'I have 10 apples'),
(164, 'top', 'I am playing with a ball.'),
(165, 'eşek', 'Donkey is an animal.'),
(166, 'yumurta', 'I eat two eggs in breakfast.'),
(167, 'çiçek', 'Flowers smell nice.'),
(168, 'zürafa', 'Giraffe is an large animal.'),
(169, 'at', 'Horse can run very fast.');

-- --------------------------------------------------------

--
-- Table structure for table `counter_table`
--

CREATE TABLE `counter_table` (
  `id` int(11) NOT NULL,
  `counter` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `counter_table`
--

INSERT INTO `counter_table` (`id`, `counter`) VALUES
(1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `loginhistory`
--

CREATE TABLE `loginhistory` (
  `id` int(11) NOT NULL,
  `name` varchar(20) NOT NULL,
  `email` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `loginhistory`
--

INSERT INTO `loginhistory` (`id`, `name`, `email`) VALUES
(1, 'Toimur', 'toimur@gmail.com'),
(2, 'Ebrar Serra', 'serra@gmail.com'),
(3, 'Soheyb', 'soheyb@gmail.com'),
(4, 'Muhab', 'muhab@gmail.com'),
(5, 'Muhab', 'muhab@gmail.com'),
(6, 'Toimur', 'toimur@gmail.com'),
(7, 'Ebrar Serra', 'serra@gmail.com'),
(8, 'Toimur', 'toimur@gmail.com'),
(9, 'Ebrar Serra', 'serra@gmail.com'),
(10, 'Muhab', 'muhab@gmail.com'),
(11, 'Toimur', 'toimur@gmail.com'),
(12, 'Ebrar Serra', 'serra@gmail.com'),
(13, 'Toimur', 'toimur@gmail.com'),
(14, 'Ebrar Serra', 'serra@gmail.com'),
(15, 'Muhab', 'muhab@gmail.com'),
(16, 'Toimur', 'toimur@gmail.com'),
(17, 'Muhab', 'muhab@gmail.com'),
(18, 'Muhab', 'muhab@gmail.com'),
(19, 'Toimur', 'toimur@gmail.com'),
(20, 'Ebrar Serra', 'serra@gmail.com'),
(21, 'Toimur', 'toimur@gmail.com'),
(22, 'Ebrar Serra', 'serra@gmail.com'),
(23, 'Toimur', 'toimur@gmail.com');

--
-- Triggers `loginhistory`
--
DELIMITER $$
CREATE TRIGGER `after_insert_loginhistory` AFTER INSERT ON `loginhistory` FOR EACH ROW BEGIN
    CALL insert_timerend_part2();
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `random`
--

CREATE TABLE `random` (
  `id` int(11) NOT NULL,
  `english` varchar(30) NOT NULL,
  `turkish` varchar(30) NOT NULL,
  `sentence` varchar(100) NOT NULL,
  `image` varchar(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Stand-in structure for view `report_view`
-- (See below for the actual view)
--
CREATE TABLE `report_view` (
`id` int(11)
,`name` varchar(20)
,`surname` varchar(20)
,`age` int(11)
,`total_score` decimal(32,0)
,`score_percentage` decimal(38,2)
);

-- --------------------------------------------------------

--
-- Table structure for table `resulthistory`
--

CREATE TABLE `resulthistory` (
  `id` int(11) NOT NULL,
  `loginID` int(11) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `score` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `resulthistory`
--

INSERT INTO `resulthistory` (`id`, `loginID`, `date`, `time`, `score`) VALUES
(13, 1, '2024-05-20', '21:06:14', 6),
(14, 2, '2024-05-20', '21:26:24', 6),
(15, 4, '2024-05-20', '21:32:10', 2),
(16, 4, '2024-05-20', '21:33:02', 6),
(17, 3, '2024-05-21', '00:38:56', 3),
(18, 3, '2024-05-21', '14:45:19', 10),
(19, 3, '2024-05-21', '16:38:38', 10),
(20, 3, '2024-05-21', '17:48:49', 5),
(21, 3, '2024-05-21', '17:49:37', 6),
(22, 3, '2024-05-21', '18:01:53', 6),
(23, 3, '2024-05-22', '00:28:14', 0),
(24, 3, '2024-05-22', '00:28:21', 0),
(25, 3, '2024-05-22', '00:29:14', 7),
(26, 3, '2024-05-22', '00:29:56', 7),
(27, 3, '2024-05-22', '00:30:33', 6),
(28, 3, '2024-05-22', '00:34:37', 6),
(29, 3, '2024-05-22', '00:38:07', 6),
(30, 3, '2024-05-22', '00:39:04', 6),
(31, 3, '2024-05-22', '01:08:47', 6),
(32, 3, '2024-05-22', '11:32:46', 5),
(33, 3, '2024-05-22', '11:32:57', 5),
(34, 3, '2024-05-22', '11:33:34', 6),
(35, 2, '2024-05-22', '12:06:44', 0),
(36, 2, '2024-05-22', '12:06:49', 0),
(37, 2, '2024-05-22', '12:07:29', 6),
(38, 1, '2024-05-22', '12:08:40', 1),
(39, 1, '2024-05-22', '12:26:39', 6),
(40, 2, '2024-05-22', '12:30:07', 7);

-- --------------------------------------------------------

--
-- Table structure for table `time`
--

CREATE TABLE `time` (
  `id` int(11) NOT NULL,
  `intervalTime` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `time`
--

INSERT INTO `time` (`id`, `intervalTime`) VALUES
(1, '00:01:00'),
(2, '00:02:00'),
(3, '00:03:00'),
(4, '00:04:00'),
(5, '00:05:00'),
(6, '00:06:00');

-- --------------------------------------------------------

--
-- Table structure for table `timerend`
--

CREATE TABLE `timerend` (
  `timerID` int(11) NOT NULL,
  `playerID` int(11) NOT NULL,
  `timeEND` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `timerend`
--

INSERT INTO `timerend` (`timerID`, `playerID`, `timeEND`) VALUES
(1, 5, '17:48:11'),
(2, 5, '17:59:38'),
(3, 5, '18:01:10'),
(4, 5, '18:21:55'),
(5, 2, '18:43:43'),
(6, 1, '18:26:07'),
(7, 2, '18:27:18'),
(8, 5, '18:35:13'),
(9, 1, '18:35:30'),
(10, 2, '18:35:48'),
(11, 1, '22:38:16'),
(12, 2, '00:12:16'),
(13, 2, '00:14:05'),
(14, 5, '00:15:58'),
(15, 5, '00:35:05'),
(16, 5, '01:10:48'),
(17, 5, '01:09:16'),
(18, 5, '01:09:34'),
(19, 5, '11:27:13'),
(20, 5, '11:29:46'),
(21, 5, '11:36:35'),
(22, 2, '12:06:12'),
(23, 2, '12:11:30'),
(24, 1, '12:08:02'),
(25, 1, '12:31:42'),
(26, 2, '12:28:07'),
(27, 2, '12:36:15'),
(28, 1, '21:17:27');

-- --------------------------------------------------------

--
-- Table structure for table `wordlimit`
--

CREATE TABLE `wordlimit` (
  `limitID` int(11) NOT NULL,
  `newLimit` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `wordlimit`
--

INSERT INTO `wordlimit` (`limitID`, `newLimit`) VALUES
(1, 7),
(2, 8),
(3, 10),
(4, 6),
(5, 7),
(6, 6),
(7, 7);

-- --------------------------------------------------------

--
-- Table structure for table `words`
--

CREATE TABLE `words` (
  `id` int(11) NOT NULL,
  `english` varchar(25) NOT NULL,
  `turkish` varchar(25) NOT NULL,
  `sentence` varchar(100) NOT NULL,
  `image` varchar(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `words`
--

INSERT INTO `words` (`id`, `english`, `turkish`, `sentence`, `image`) VALUES
(1, 'Apple', 'Elma', 'I have 10 apples', 'image_1715522718931.jpg'),
(2, 'Ball', 'Top', 'I am playing with a ball.', 'image_1715522803553.jpg'),
(4, 'Cat', 'Kedi', 'Cats are friendly', 'image_1715530171198.jpg'),
(13, 'Donkey', 'Eşek', 'Donkey is an animal.', 'image_1716203038834.jpg'),
(14, 'Egg', 'Yumurta', 'I eat two eggs in breakfast.', 'image_1716203086180.webp'),
(15, 'Flower', 'Çicek', 'Flowers smell nice.', 'image_1716203125030.jpg'),
(16, 'Giraffe', 'Zürafa', 'Giraffe is an large animal.', 'image_1716203218249.webp'),
(17, 'Horse', 'At', 'Horse can run very fast.', 'image_1716203695975.webp'),
(18, 'Ice-cream ', 'Dondurma ', 'I love ice-cream', 'image_1716204714769.jpg'),
(19, 'Juice', 'Meyve suyu', 'Juice is good for health.', 'image_1716204830273.jpg');

-- --------------------------------------------------------

--
-- Structure for view `report_view`
--
DROP TABLE IF EXISTS `report_view`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `report_view`  AS SELECT `a`.`id` AS `id`, `a`.`name` AS `name`, `a`.`surname` AS `surname`, `a`.`age` AS `age`, sum(`rh`.`score`) AS `total_score`, round(sum(`rh`.`score`) / (count(`rh`.`score`) * `get_latest_word_limit`()) * 100,2) AS `score_percentage` FROM (`admin` `a` join `resulthistory` `rh` on(`a`.`id` = `rh`.`loginID`)) GROUP BY `a`.`id`, `a`.`name`, `a`.`surname`, `a`.`age` ORDER BY `a`.`id` ASC ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `answers`
--
ALTER TABLE `answers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `counter_table`
--
ALTER TABLE `counter_table`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `loginhistory`
--
ALTER TABLE `loginhistory`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `random`
--
ALTER TABLE `random`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `resulthistory`
--
ALTER TABLE `resulthistory`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `timerend`
--
ALTER TABLE `timerend`
  ADD PRIMARY KEY (`timerID`);

--
-- Indexes for table `wordlimit`
--
ALTER TABLE `wordlimit`
  ADD PRIMARY KEY (`limitID`);

--
-- Indexes for table `words`
--
ALTER TABLE `words`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `answers`
--
ALTER TABLE `answers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=170;

--
-- AUTO_INCREMENT for table `counter_table`
--
ALTER TABLE `counter_table`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `loginhistory`
--
ALTER TABLE `loginhistory`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `random`
--
ALTER TABLE `random`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `resulthistory`
--
ALTER TABLE `resulthistory`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT for table `timerend`
--
ALTER TABLE `timerend`
  MODIFY `timerID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `wordlimit`
--
ALTER TABLE `wordlimit`
  MODIFY `limitID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `words`
--
ALTER TABLE `words`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
