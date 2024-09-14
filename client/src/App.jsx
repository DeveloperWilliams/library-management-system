import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Login from "./components/Auth/Login";
import Home from "./components/User/Home/Home";
import Admin from "./components/Admin/Home/Admin";
import Add from "./components/Admin/AddBook/Add";
import Booknow from "./components/User/Book/Book";

function App() {
  const isAutheniticated = () => {
    return localStorage.getItem("token") !== null;
  };
  return (
    <>
      <Routes>
        Auth Routes
        <Route path="/" element={<Login />} />
        //User Routes
        <Route
          path="/welcome"
          element={isAutheniticated() ? <Home /> : <Navigate to="/" />}
        />
        <Route
          path="/welcome/:id"
          element={isAutheniticated() ? <Booknow /> : <Navigate to="/" />}
        />
        //Admin Routes
        <Route
          path="/admin"
          element={isAutheniticated() ? <Admin /> : <Navigate to="/" />}
        />
        <Route
          path="/admin/add-new-book"
          element={isAutheniticated() ? <Add /> : <Navigate to="/" />}
        />
      </Routes>
    </>
  );
}

export default App;
