import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./home.css";
import { useEffect, useState } from "react";
import axios from "axios";
import AdminTop from "../../Admin/Home/AdminTop";
import { toast, ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


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

  const addToCart = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        `http://localhost:8080/book/cart/add`,
        { bookId: id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.message == "Book added to cart") {
        toast.success("Book added to cart");  
      }
    } catch (error) {
      if (error.response.data.message == "Book already in cart") {
        return toast.error("Book already in cart")
      } else if (error.response.data.message == "3 books") {
        return toast.error("You can only add 3 books to cart")
      } else {
        return toast.error("Something went wrong");
      }
    }
  };

  return (
    <>
      <div className="User">
      <ToastContainer
          position="top-center"
          autoClose={3000}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          transition={Bounce}
        />
        <AdminTop />
        <h1>Mathematics Books</h1>
        <div className="books">
          {mathBook &&
            mathBook.map((book) => (
              <div className="book" key={book._id}>
                <img src={book.imageUrl} alt="book" />
                <h3>{book.title}</h3>
                <p>{book.author}</p>
                <p>{book.price}</p>
                <button onClick={() => addToCart(book._id)}>Add to Cart</button>
              </div>
            ))}
        </div>
        <h1>English Books</h1>
        <div className="eng">
          <div className="books">
            {engBook &&
              engBook.map((book) => (
                <div className="book" key={book._id}>
                  <img src={book.imageUrl} alt="book" />
                  <h3>{book.title}</h3>
                  <p>{book.author}</p>
                  <p>{book.price}</p>
                  <button onClick={() => addToCart(book._id)}>
                    Add to Cart
                  </button>
                </div>
              ))}
          </div>
        </div>
        <h1>Computer Books</h1>
        <div className="comp">
          <div className="books">
            {compBook &&
              compBook.map((book) => (
                <div className="book" key={book._id}>
                  <img src={book.imageUrl} alt="book" />
                  <h3>{book.title}</h3>
                  <p>{book.author}</p>
                  <p>{book.price}</p>
                  <button onClick={() => addToCart(book._id)}>
                    Add to Cart
                  </button>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
