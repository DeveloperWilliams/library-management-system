import Book from "../models/Book.js";
import Request from "../models/Request.js";
import User from "../models/User.js";
import multer from "multer";
import path from "path";

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

    const booksWithImageURL = books.map((book) => ({
      ...book._doc, // Spread the existing book data
      imageUrl: `${req.protocol}://${req.get("host")}/uploads/${path.basename(
        book.img
      )}`,
    }));

    res.json(booksWithImageURL);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// fetch Mathematics Books
export const getMathBooks = async (req, res) => {
  try {
    const mathBooks = await Book.find({ category: "Mathematics" });

    // Add the image URL to each book
    const booksWithImageURL = mathBooks.map((book) => ({
      ...book._doc,
      imageUrl: `${req.protocol}://${req.get("host")}/${path.posix.join(
        book.img
      )}`,
    }));

    res.json(booksWithImageURL);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// fetch Eng Books
export const getEngBooks = async (req, res) => {
  try {
    const engBooks = await Book.find({ category: "English" });

    // Add the image URL to each book
    const booksWithImageURL = engBooks.map((book) => ({
      ...book._doc,
      imageUrl: `${req.protocol}://${req.get("host")}/${path.posix.join(
        book.img
      )}`,
    }));

    res.json(booksWithImageURL);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// fetch Comp Books
export const getCompBooks = async (req, res) => {
  try {
    const compBooks = await Book.find({ category: "Computer" });

    // Add the image URL to each book
    const booksWithImageURL = compBooks.map((book) => ({
      ...book._doc,
      imageUrl: `${req.protocol}://${req.get("host")}/${path.posix.join(
        book.img
      )}`,
    }));

    res.json(booksWithImageURL);
  } catch (error) {
    res.status(500).json({ error: error.message });
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

    const user = await User.findById(userId);
    if (user.cart.length >= 3) {
      return res.status(400).json({ message: "3 books" });
    }

    if (user.cart.includes(bookId)) {
      return res.status(400).json({ message: "Book already in cart" });
    }

    user.cart.push(bookId);
    await user.save();
    res.json({ message: "Book added to cart" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get books in cart
export const getCart = async (req, res) => {
  const userId = req.user.id;
  try {
    const user = await User.findById(userId).populate("cart");

    res.status(200).json({
      message: "Books in cart",
      cart: user.cart,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCartLength = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId).populate("cart");

    res.json({ cartLength: user.cart.length });
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
    // Check if the user has a pending request
    const existingPendingRequest = await Request.findOne({
      user: userId,
      status: "pending",
    });

    if (existingPendingRequest) {
      return res.status(400).json({ message: "You have a pending request" });
    }

    // Fetch the user and populate the cart
    const user = await User.findById(userId).populate("cart");

    // Create an array of book requests
    const bookRequests = user.cart.map((bookId) => ({
      user: userId,
      book: bookId,
    }));

    // Insert new requests into the database
    const requests = await Request.insertMany(bookRequests);

    // Clear the user's cart
    user.cart = [];
    await user.save();

    // Respond with success message
    res.status(201).json({ message: "Request submitted", requests });
  } catch (err) {
    // Handle errors
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
