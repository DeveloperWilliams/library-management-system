import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import nodemailer from "nodemailer";

//nodemailer
const transpoter = nodemailer.createTransport({
  host: "mail.willsoft.co.ke",
  port: "465",
  secure: true,
  auth: {
    user: "verify@willsoft.co.ke",
    pass: "archyJNR123.",
  },
});

//signUp
export const Register = async (req, res) => {
  const { username, password, fullNames } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = User({ username, password: hashedPassword, fullNames });
    await newUser.save();
    const token = jwt.sign({ username: username }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const url = `http://localhost:3000/verify${token}`;

    const mailOptions = {
      from: "verify@willsoft.co.ke",
      to: username,
      subject: "Verify Email",
      text: `Verify ${url}`,
    };

    transpoter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error sending email:", error);
      } else {
        console.log("Email sent successfully!");
      }
    });

    res.status(201).json({ message: "Created", url });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

//login
export const Login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "Not Found" });
    }

    if (!user.isActive) {
      return res.status(400).json({ message: "Account Suspended" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "success",
      token,
      user: {
        username: user.username,
        role: user.role,
        id: user._id,
        name: user.fullNames,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
};
