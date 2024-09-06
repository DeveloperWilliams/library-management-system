import express from "express";
import { Register, Login } from "../controllers/auth.js";
import authenticate from "../middleware/auth.js";

const router = express.Router();

router.post("/register", Register);
router.post("/login", Login);
router.get("/protected", authenticate, (req, res) => {
  res.send("You are in protected route");
});

router.get("/protected-admin", authenticate, (req, res) => {
  res.send("You are in protected route");
});

export default router;
