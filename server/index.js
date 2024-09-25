import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./server/routes/auth.js";
import bookRoutes from "./server/routes/books.js"
import mongoose from "mongoose";
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

// Get __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(express.json()); 
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
 
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
