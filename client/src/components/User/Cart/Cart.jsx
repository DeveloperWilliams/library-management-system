import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Cart.css";
import AdminTop from "../../Admin/Home/AdminTop";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [removingBookId, setRemovingBookId] = useState(null); // Track book being removed

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
        navigate("/cart");
      } catch (error) {
        navigate("/");
        console.log(error);
      }
    };

    const fetchCart = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get("http://localhost:8080/book/cart", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCart(response.data.cart);
      } catch (error) {
        console.error("Error fetching cart data:", error);
      }
    };

    fetchCart();
    VerifyToken();
  }, []);

  // Function to remove a book from the cart
  const removeFromCart = async (bookId) => {
    const token = localStorage.getItem("token");
    setRemovingBookId(bookId); // Set the book ID being removed

    try {
      // Send delete request to the server
      await axios.delete(`http://localhost:8080/book/cart/${bookId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Update the cart state and show success message
      setCart(cart.filter((book) => book._id !== bookId));
      toast.success("Book Removed Successfully");
    } catch (error) {
      // Handle error in removing the book
      console.error("Error removing book from cart:", error);
    } finally {
      // Reset removing state
      setRemovingBookId(null);
    }
  };

  const checkOut = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        `http://localhost:8080/book/cart/request`,
        {}, // Empty body, since headers are passed separately
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.message === "Request submitted") {
        toast.success("Request Submitted Successfully");
        setCart([]);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error submitting request");
    }
  };

  return (
    <div className="cart-container">
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
      <h2>Your Cart</h2>
      <div className="cart-items">
        {cart.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          cart.map((book) => (
            <div className="book-item" key={book._id}>
              <img
                src={`http://localhost:8080/${book.img}`}
                alt={book.title}
                className="book-image"
              />
              <h3>{book.title}</h3>
              <p>{book.author}</p>
              <button
                onClick={() => removeFromCart(book._id)}
                disabled={removingBookId === book._id} // Disable button if this book is being removed
              >
                {removingBookId === book._id
                  ? "Removing..."
                  : "Remove from Cart"}
              </button>
            </div>
          ))
        )}
      </div>

      {cart.length !== 0 && (
        <div className="cart-button-div">
          <button onClick={checkOut} className="cart-button">
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
