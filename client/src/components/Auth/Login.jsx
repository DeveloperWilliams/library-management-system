import React, { useState } from "react";
import "./auth.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login() {
  const Navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/auth/login", {
        username: email,
        password,
      });


      if (response.data.message == "success") {
        localStorage.setItem("username", response.data.user.username);
        localStorage.setItem("role", response.data.user.role);
        localStorage.setItem("name", response.data.user.name);
        localStorage.setItem("token", response.data.token);
        if (response.data.user.role === "admin") {
          return Navigate("/admin");
        }
        if (response.data.user.role === "user") {
          return Navigate(`/welcome`);
        }
      }
    } catch (error) {
      if (error.response.status === 404) {
         toast.error("Email not found");
      } else if (error.response.status === 400) {
        return toast.error("Invalid Password");
      } else {
        return toast.error("An error occurred, try again");
      }
    }
  };

  return (
    <>
      <div className="home">
        <ToastContainer
          position="top-center"
          autoClose={5000}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          transition={Bounce}
        />
        <div className="login">
          <div className="left">
            <img src="./Login.svg" />
          </div>
          <div className="right">
            <form onSubmit={handleSubmit}>
              <h5>Login</h5>
              <div>
                <input
                  type="email"
                  placeholder="Email Address"
                  required
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="myLogin">
                <button type="submit">Login</button>
                <Link to="/register">Register Now</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
