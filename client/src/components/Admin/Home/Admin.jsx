import React from "react";
import "./Admin.css";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import MyAdminTop from "./MyAdminTop";

function Admin() {
  const navigate = useNavigate();

  useEffect(() => {
    const VerifyToken = async () => {
      const token = localStorage.getItem("token");
      try {
        await axios.get("http://localhost:8080/auth/protected", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        navigate("/admin");
      } catch (error) {
        navigate("/");
      }
    };
    VerifyToken();
  }, [navigate]);

  return (
    <>
      <div className="admin">
        <MyAdminTop/>
      </div>
    </>
  );
}

export default Admin;
