import React, { useState, useRef } from "react";
import "./Add.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MyAdminTop from "../Home/MyAdminTop";

function Add() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");
  const [quanitity, setQuanity] = useState("");
  const [file, setFile] = useState(null);

  const navigate = useNavigate();
  const fileInputRef = useRef(null); // Create a reference for the file input

  const clearForm = () => {
    setTitle("");
    setAuthor("");
    setCategory("");
    setQuantity("");
    setFile(null); // Clear file state

    // Clear the file input field by targeting the DOM element directly
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // This clears the file input
    }
  };

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("author", author);
    formData.append("category", category);
    formData.append("quantity", quanitity);
    formData.append("img", file); // append file

    try {
      const response = await axios.post(
        "http://localhost:8080/book/add",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.data.message === "success") {
        console.log("Success");
        toast.success("Book Added Succesfully");
        clearForm();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="admin">
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
        <MyAdminTop />  
        <div className="addBook">
          <h5>Add New Book</h5>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Book Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Book Author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Book Quanitity"
              value={quanitity}
              onChange={(e) => setQuanity(e.target.value)}
              required
            />
            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              list="category"
              id="category"
              placeholder="Book Category"
              required
            />
            <datalist id="category">
              <option value="Mathematics" />
              <option value="English" />
              <option value="Computer" />
            </datalist>
            <input
              className="file"
              placeholder="Book Image"
              type="file"
              name="file"
              onChange={handleFileChange}
              required
            />
            <button>Submit</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Add;
