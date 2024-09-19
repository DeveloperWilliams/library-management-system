import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function MyAdminTop() {
  const navigate = useNavigate();
  const [cartLength, setCartLength] = useState(null);

  const onLogOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    navigate("/");
  };

  return (
    <div className="top">
      <h6>
        <Link to="/admin">Archy</Link>
      </h6>
      <ul>
        <li>
          Hello, <em>{localStorage.getItem("name")}</em>
        </li>
        <li>
          <button onClick={onLogOut}>Log Out</button>
        </li>
      </ul>
    </div>
  );
}

export default MyAdminTop;
