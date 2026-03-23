const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // Prevents duplicate accounts
    },
    image: {
      type: String, // To store the Google profile picture URL
    },
    isPremium: {
      type: Boolean,
      default: false, // Everyone starts as a free user
    },
    channelName: {
      type: String,
      default: "", // Users can set this later
    },
    // We'll use this later for the 3-video daily limit task
    dailyViewCount: {
      date: { type: String, default: new Date().toLocaleDateString() },
      count: { type: Number, default: 0 }
    }
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

module.exports = mongoose.model("User", UserSchema);