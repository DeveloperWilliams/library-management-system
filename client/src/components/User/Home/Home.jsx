import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./home.css";
import { useEffect, useState } from "react";
import axios from "axios";
import AdminTop from "../../Admin/Home/AdminTop";

function Home() {
  const [mathBook, setMathBook] = useState("");
  const [engBook, setEngBook] = useState("");
  const [compBook, setCompBook] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    //Verify Token
    const VerifyToken = async () => {
      const token = localStorage.getItem("token");
      try {
        await axios.get("http://localhost:8080/auth/protected", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        navigate("/welcome");
      } catch (error) {
        navigate("/");
        console.log(error);
      }
    };

    //Get Math Book
    const getMathBooks = async () => {
      try {
        const response = await axios.get("http://localhost:8080/book/math");
        setMathBook(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    //Get English Book
    const getEngBooks = async () => {
      try {
        const response = await axios.get("http://localhost:8080/book/english");
        setEngBook(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    //Get Comp Books
    const getCompBooks = async () => {
      try {
        const response = await axios.get("http://localhost:8080/book/comp");
        setCompBook(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    //call Functions
    getMathBooks();
    getEngBooks();
    getCompBooks();
    VerifyToken();
  }, [navigate]);

  console.log(mathBook, engBook, compBook);

  return (
    <>
      <div className="User">
        <AdminTop />
      </div>
    </>
  );
}

export default Home;
