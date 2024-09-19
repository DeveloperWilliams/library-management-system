import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function AdminTop() {
  const navigate = useNavigate();
  const [cartLength, setCartLength] = useState(null);

  const onLogOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    navigate("/");
  };

  useEffect(() => {
    const fetchCartLength = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          "http://localhost:8080/book/cart/length",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCartLength(response.data.cartLength); // Update the cart length
      } catch (error) {
        console.error("Error fetching cart data:", error);
      }
    };

    // Fetch cart length immediately when the component mounts
    fetchCartLength();

    // Set up a polling interval to refresh the cart length every 10 seconds
    const interval = setInterval(fetchCartLength, 1000); 

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []); // Empty dependency array ensures this effect runs once when the component mounts

  return (
    <div className="top">
      <h6>
        <Link to='/welcome'>Archy</Link>
      </h6>
      <ul>
        <li>
          Hello, <em>{localStorage.getItem("name")}</em>
        </li>
        <li>
          <button onClick={onLogOut}>Log Out</button>
        </li>
        <li>
          <Link className="cart" to="/cart">
            <img src="/cart.png" alt="Cart" />
            <div className="num">{cartLength}</div>
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default AdminTop;
