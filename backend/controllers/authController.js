import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


// SIGNUP

export const signup = async (req, res) => {
  try {
    const { username, password } = req.body;

    
    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password are required",
      });
    }

    
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({
        message: "Username already exists",
      });
    }

   
    const hashedPassword = await bcrypt.hash(password, 10);

  
    const user = await User.create({
      username,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Signup successful",
      user: {
        id: user._id,
        username: user.username,
      },
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// LOGIN

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

  
    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password are required",
      });
    }

    
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({
        message: "Invalid username or password",
      });
    }

   
    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(400).json({
        message: "Invalid username or password",
      });
    }

    
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.json({
      message: "Login successful",

      token,

      user: {
        id: user._id,
        username: user.username,
      },
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};