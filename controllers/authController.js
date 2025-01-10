import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userRegister } from "../userSeed.js";

const login = async (req, res) => {
  // Verify user credentials
  try {
    //
    console.log("trying to login . . .");
    res.setHeader("Access-Control-Allow-Origin", "*");
    // res.setHeader(
    //   "Access-Control-Allow-Origin",
    //   "https://ems-frontend-six.vercel.app"
    // );
    // res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
    res.setHeader("Access-Control-Allow-Credentials", "true");
    console.log("headers are set . . .");

    const { email, password } = req.body;

    if (email === "admin@gmail.com") {
      try {
        // Check if the admin user exists
        const existingAdmin = await User.findOne({ email });

        // If admin user does not exist, run the userSeed to create the admin user
        if (!existingAdmin) {
          console.log(
            "Admin user not found. Running userSeed to create admin."
          );
          await userRegister(); // This will create the admin user if it doesn't exist
        }
      } catch (err) {
        console.log(err);
        return res.status(500).json({
          success: false,
          error: "Error checking or creating admin user.",
        });
      }
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, error: "User Not Found" });
    }

    // If user exists, verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(404)
        .json({ success: false, error: "Password Incorrect" });
    }

    // If password matches, generate a token
    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_KEY,
      { expiresIn: "10d" }
    );

    return res.status(200).json({
      success: true,
      token,
      user: { _id: user._id, name: user.name, role: user.role },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

const verify = (req, res) => {
  return res.status(200).json({ success: true, user: req.user });
};

export { login, verify };
