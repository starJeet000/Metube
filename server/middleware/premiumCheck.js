import jwt from "jsonwebtoken";
import User from "../model/User.js";

export const premiumCheck = async (req, res, next) => {
  try {
    // 1. Grab the token from the request header (Frontend sends this)
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }

    // 2. Verify the token using your secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Find the user in the database using the ID hidden inside the token
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // 4. The Ultimate Check: Are they actually Premium?
    if (!user.isPremium) {
      return res.status(403).json({ 
        message: "Access blocked. This feature requires a Premium subscription." 
      });
    }

    // 5. If they passed all checks, attach the user info to the request 
    // and tell the server to proceed to the Controller!
    req.user = user;
    next(); 

  } catch (error) {
    console.error("Middleware Error:", error);
    res.status(401).json({ message: "Invalid or expired token." });
  }
};