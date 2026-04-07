import express from "express";
import Razorpay from "razorpay";
import dotenv from 'dotenv';
import crypto from "crypto"; //Required to verify Razorpay's secure signature
import User from "../Modals/User.js"; //Required to upgrade the user to Premium

dotenv.config();

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

router.post("/create-order", async (req, res) => {
  try {
    const options = {
      amount: 50000, // ₹500
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };
    const order = await razorpay.orders.create(options);
    if (!order) return res.status(500).json({ error: "Failed to create order" });
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

//The secure verification route
router.post("/verify-payment", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId } = req.body;

    // Create our own signature to verify against the one Razorpay sent
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    // Check if the signatures match exactly
    if (razorpay_signature === expectedSign) {
      // Payment is legit! Upgrade the user to Premium in MongoDB
      await User.findByIdAndUpdate(userId, { $set: { isPremium: true } });
      
      return res.status(200).json({ message: "Payment verified successfully!" });
    } else {
      return res.status(400).json({ message: "Invalid signature sent!" });
    }
  } catch (error) {
    console.error("Verification Error:", error);
    return res.status(500).json({ message: "Internal Server Error!" });
  }
});

export default router;
