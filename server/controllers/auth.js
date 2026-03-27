import mongoose from "mongoose";
import users from "../Modals/User.js";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  const { email, name, image } = req.body;

  try {
    const existingUser = await users.findOne({ email });

    if (!existingUser) {
      const newUser = await users.create({ email, name, image });
      
      const token = jwt.sign(
        { email: newUser.email, id: newUser._id },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      return res.status(201).json({ result: newUser, token });
    } else {
      
      const token = jwt.sign(
        { email: existingUser.email, id: existingUser._id },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      return res.status(200).json({ result: existingUser, token });
    }
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const updateprofile = async (req, res) => {
  const { id: _id } = req.params;
  const { channelName, description } = req.body; //Fixed: channelName (camelCase)
  
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(500).json({ message: "User unavailable..." });
  }
  
  try {
    const updatedata = await users.findByIdAndUpdate(
      _id,
      {
        $set: {
          channelName: channelName, //Fixed: Matches database schema
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