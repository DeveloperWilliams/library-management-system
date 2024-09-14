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


  return (
    <>
      <div className="User">
        <AdminTop />
        <h1>Mathematics Books</h1>
        <div className="books">
          {mathBook &&
            mathBook.map((book) => (
              <Link to={book._id}>
                <div className="book" key={book._id}>
                  <img src={book.imageUrl} alt="book" />
                  <h3>{book.title}</h3>
                  <p>{book.author}</p>
                  <p>{book.price}</p>
                </div>
              </Link>
            ))}
        </div>
        <h1>English Books</h1>
        <div className="eng">
          <div className="books">
            {engBook &&
              engBook.map((book) => (
                <Link to={book._id}>
                  <div className="book" key={book._id}>
                    <img src={book.imageUrl} alt="book" />
                    <h3>{book.title}</h3>
                    <p>{book.author}</p>
                    <p>{book.price}</p>
                  </div>
                </Link>
              ))}
          </div>
        </div>
        <h1>Computer Books</h1>
        <div className="comp">
          <div className="books">
            {compBook &&
              compBook.map((book) => (
                <Link to={book._id}>
                  <div className="book" key={book._id}>
                    <img src={book.imageUrl} alt="book" />
                    <h3>{book.title}</h3>
                    <p>{book.author}</p>
                    <p>{book.price}</p>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
