import mongoose from "mongoose";
import users from "../Modals/Auth.js";
import jwt from "jsonwebtoken"; // 🌟 NEW: Imported JWT

export const login = async (req, res) => {
  const { email, name, image } = req.body;

  try {
    const existingUser = await users.findOne({ email });

    if (!existingUser) {
      const newUser = await users.create({ email, name, image });
      
      // 🌟 NEW: Generate token for the new user
      const token = jwt.sign(
        { email: newUser.email, id: newUser._id },
        process.env.JWT_SECRET,
        { expiresIn: "7d" } // Token expires in 7 days
      );

      return res.status(201).json({ result: newUser, token }); // 🌟 UPDATED: Sending token back
    } else {
      
      // 🌟 NEW: Generate token for the existing user
      const token = jwt.sign(
        { email: existingUser.email, id: existingUser._id },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      return res.status(200).json({ result: existingUser, token }); // 🌟 UPDATED: Sending token back
    }
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const updateprofile = async (req, res) => {
  const { id: _id } = req.params;
  const { channelname, description } = req.body;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(500).json({ message: "User unavailable..." });
  }
  try {
    const updatedata = await users.findByIdAndUpdate(
      _id,
      {
        $set: {
          channelname: channelname,
          description: description,
        },
      },
      { new: true }
    );
    return res.status(201).json(updatedata);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};