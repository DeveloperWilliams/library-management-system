import express from "express";
import {
  addBook,
  getBooks,
  deleteBook,
  approveRequest,
  rejectRequest,
  getAllRequests,
  getUserRequests,
  addToCart,
  removeFromCart,
  requestBooksFromCart,
  getMathBooks,
  getEngBooks,
  getCompBooks,
} from "../controllers/books.js";
import authenticate from "../middleware/auth.js";

const router = express.Router();

// Admin routes
router.post("/add", addBook);
router.get("/", getBooks);
router.get("/math", getMathBooks);
router.get("/english", getEngBooks);
router.get("/comp", getCompBooks);
router.delete("/:id", deleteBook);
router.get("/requests", getAllRequests); // Admin views all requests
router.put("/requests/approve/:requestId", approveRequest); // Admin approves request
router.put("/requests/reject/:requestId", rejectRequest); // Admin rejects request

// User routes
router.get("/my-requests", getUserRequests); // User views their requests

// Cart routes with authentication
router.post("/cart", authenticate, addToCart); // User adds a book to their cart
router.delete("/cart/:bookId", authenticate, removeFromCart); // User removes a book from their cart
router.post("/cart/request", authenticate, requestBooksFromCart); // User requests all books in their cart

export default router;
