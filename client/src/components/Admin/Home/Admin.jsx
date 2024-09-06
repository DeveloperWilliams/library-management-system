import React from "react";
import "./Admin.css";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";

function Admin() {
  const navigate = useNavigate();

  const onLogOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    navigate("/");
  };

  useEffect(() => {
    const VerifyToken = async () => {
      const token = localStorage.getItem("token");
      try {
        await axios.get("http://localhost:8080/auth/protected", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        navigate("/admin")
      } catch (error) {
        navigate("/");
      }
    };
    VerifyToken();
  }, [navigate]);

  return (
    <>
      <div className="admin">
        <div className="top">
          <h6>Archy</h6>
          <ul>
            <li>
              Hello, <em>{localStorage.getItem("name")}</em>
            </li>
            <li>
              <button onClick={onLogOut}>Log Out</button>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default Admin;
