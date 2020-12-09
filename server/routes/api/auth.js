import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import auth from "../../middleware/auth";
import config from "../../config/index";
const { JWT_SECRET } = config;

// Model
import User from "../../models/user";

const router = express.Router();

// @route   POST    api/auth
// @desc    Auth    user
// @access  PUBLIC

router.post("/", (req, res) => {
  const { email, password } = req.body;

  // Simple Validation
  if (!email || !password) {
    return res.status(400).json({ msg: "fill all the field." });
  }

  //Checking for existing user
  User.findOne({ email }).then((user) => {
    if (!user)
      return res.status(400).json({ msg: "the user is not existing." });

    // Validation for Password
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (!isMatch) return res.status(400).json({ msg: " password is wrong." });

      jwt.sign(
        { id: user.id },
        JWT_SECRET,
        { expiresIn: "2 days" },
        (err, token) => {
          if (err) throw err;

          res.json({
            token,
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            },
          });
        }
      );
    });
  });
});

router.post("/logout", (req, res) => {
  res.json({ msg: "You are loged out!" });
});

// @route   GET /api/auth/user
// @desc    getting user's data
// @access

router.get("/user", auth, async (req, res) => {
  try {
    // getting user data from DB without password
    const user = await User.findById(req.user.id).select("-password");

    //Simple validation
    if (!user) return res.status(400).json({ msg: "No user found" });

    res.json(user);
  } catch (e) {
    console.log(e);
    res.status(400).json({
      msg: e.message,
    });
  }
});

export default router;
