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
  getCart,
  getCartLength
} from "../controllers/books.js";
import authenticate from "../middleware/auth.js";
import multer from "multer";

const router = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

// Admin routes
router.post("/add", upload.single("img"), addBook);
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
router.get("/cart", authenticate, getCart); // User views their cart
router.get("/cart/length", authenticate, getCartLength); // User views the number of items in their cart
router.post("/cart/add", authenticate, addToCart); // User adds a book to their cart
router.delete("/cart/:bookId", authenticate, removeFromCart); // User removes a book from their cart
router.post("/cart/request", authenticate, requestBooksFromCart); // User requests all books in their cart

export default router;
