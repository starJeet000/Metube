import express from "express";
import Razorpay from "razorpay";
import dotenv from 'dotenv';

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

export default router;