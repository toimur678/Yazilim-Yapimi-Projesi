import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./Components/Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./Components/Dashboard";
import Home from "./Components/Home";
import ManageWords from "./Components/ManageWords";
import AddEmployee from "./Components/AddWords";
import Start from "./Components/Start";
import PrivateRoute from "./Components/PrivateRoute";
import Answer from "./Components/Answer";
import AddWords from "./Components/AddWords";
import Quiz from "./Components/Quiz";
import TakeQuiz from "./Components/TakeQuiz";
import EditWords from "./Components/EditWords";
import SignUP from "./Components/SignUP";
import Result from "./Components/Result";
import ForgotPassword from "./Components/ForgotPassword";
import Settings from "./Components/Settings";
import Report from "./Components/Report";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Start />}></Route>
        <Route path="/adminlogin" element={<Login />}></Route>
        <Route path="/sign_up" element={<SignUP />}></Route>
        <Route path="/forgot_password" element={<ForgotPassword />}></Route>

        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>}>

          <Route path="" element={<Home />}></Route>
          <Route path="/dashboard/manage_words"element={<ManageWords />}></Route>
          <Route path="/dashboard/quiz" element={<Quiz />}></Route>
          <Route path="/dashboard/take_quiz" element={<TakeQuiz />}></Route>
          <Route path="/dashboard/settings" element={<Settings />}></Route>
          <Route path="/dashboard/report" element={<Report />}></Route>
          <Route path="/dashboard/result" element={<Result />}></Route>
          <Route path="/dashboard/add_words" element={<AddWords />}></Route>
          <Route path="/dashboard/add_employee" element={<AddEmployee />}></Route>
          <Route path="/dashboard/edit_words/:id" element={<EditWords />}></Route>
          <Route path="/dashboard/answer/:id" element={<Answer />}></Route>

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
