import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./server/routes/auth.js";
import bookRoutes from "./server/routes/books.js"
import mongoose from "mongoose";

dotenv.config();

const app = express();

// Middleware
app.use(express.json()); 
app.use(cors());

// Routes 
app.use("/auth", authRoutes); // http://localhost:8080/auth/ 
app.use("/book", bookRoutes); // http://localhost:8080/book/ 

// Connect to MongoDB
const PORT = process.env.PORT;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() =>
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
  )
  .catch((err) => console.log(err));
