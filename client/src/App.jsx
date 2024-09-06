import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Login from "./components/Auth/Login";
import Home from "./components/User/Home/Home";
import Admin from "./components/Admin/Home/Admin";
function App() {
  const isAutheniticated = () => {
    return localStorage.getItem("token") !== null;
  };
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route
          path="/admin"
          element={isAutheniticated() ? <Admin /> : <Navigate to="/" />}
        ></Route>
        <Route
          path="/welcome"
          element={isAutheniticated() ? <Home /> : <Navigate to="/" />}
        ></Route>
      </Routes>
    </>
  );
}

export default App;
