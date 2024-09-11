import Book from "../models/Book.js";
import Request from "../models/Request.js";
import User from "../models/User.js";
import multer from "multer";

//multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

//addBook
export const addBook = async (req, res) => {
  const { title, author, category, quantity } = req.body;
  const imgPath = req.file.path;

  try {
    const newBook = new Book({
      title,
      author,
      category,
      quantity,
      img: imgPath,
    });

    await newBook.save();
    res.status(201).json({ message: "success" });
  } catch (error) {
    res.status(500).json({ error: "Failed to add book" });
  }
};

//get All Books
export const getBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// fetch Mathematics Books
export const getMathBooks = async (req, res) => {
  try {
    const mathBooks = await Book.find({ category: "Mathematics" });
    res.json(mathBooks);
  } catch (error) {
    res.status(500).json({});
  }
};

// fetch Eng Books
export const getEngBooks = async (req, res) => {
  try {
    const EngBooks = await Book.find({ category: "English" });
    res.json(EngBooks);
  } catch (error) {
    res.status(500).json({});
  }
};

// fetch Comp Books
export const getCompBooks = async (req, res) => {
  try {
    const compBooks = await Book.find({ category: "Computer" });
    res.json(compBooks);
  } catch (error) {
    res.status(500).json({});
  }
};

//deleteBook
export const deleteBook = async (req, res) => {
  const { id } = req.params;
  try {
    await Book.findByIdAndDelete(id);
    res.json({ message: "Book deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//// Add book to cart

export const addToCart = async (req, res) => {
  const { bookId } = req.body;

  const userId = req.user.id;

  try {
    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(400).json({ message: "Book Unavailable" });
    }

    const user = User.findById(userId);
    if (user.cart.length >= 3) {
      return res.status(400).json({ message: "3 Books" });
    }

    if (user.cart.includes(bookId)) {
      return res.status(400).json({ message: "Book Exist" });
    }

    user.cart.push(bookId);
    await user.save();
    res.json({ message: "Book added to cart" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Remove book from cart

export const removeFromCart = async (req, res) => {
  const { bookId } = req.params;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    user.cart = user.cart.filter((id) => id.toString() !== bookId);
    await user.save();
    res.json({ message: "Book removed from cart" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Request to borrow books in cart
export const requestBooksFromCart = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId).populate("cart");
    if (user.cart.length === 0) {
      return res.status(400).json({ message: "Your cart is empty" });
    }

    const bookRequests = user.cart.map((bookId) => ({
      user: userId,
      book: bookId,
    }));

    const requests = await Request.insertMany(bookRequests);

    user.cart = [];
    await user.save();

    res.status(201).json({ message: "Borrow request submitted", requests });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get user's own requests (user view)
export const getUserRequests = async (req, res) => {
  const userId = req.user.id;

  try {
    const requests = await Request.find({ user: userId }).populate("book");
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all requests (admin view)
export const getAllRequests = async (req, res) => {
  try {
    const requests = await Request.find().populate("user").populate("book");
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Admin approves a request
export const approveRequest = async (req, res) => {
  const { requestId } = req.params;

  try {
    const request = await Request.findById(requestId).populate("book");
    if (!request || request.status !== "pending") {
      return res.status(400).json({ message: "Invalid request" });
    }

    const book = request.book;
    if (book.quantity - book.borrowed <= 0) {
      return res.status(400).json({ message: "No copies available" });
    }
    request.status = "approved";
    request.approvedAt = new Date();
    book.borrowed += 1;

    await request.save();
    await book.save();
    res.json({ message: "Request approved" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const rejectRequest = async (req, res) => {
  const { requestId } = req.params;

  try {
    const request = await Request.findById(requestId);
    if (!request || request.status !== "pending") {
      return res.status(400).json({ message: "Invalid request" });
    }

    request.status = "rejected";
    request.rejectedAt = new Date();

    await request.save();
    res.json({ message: "Request rejected" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
