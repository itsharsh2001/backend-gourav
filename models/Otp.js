import mongoose from "mongoose";

const OtpSchema = mongoose.Schema({
  email: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  otp: Number,
  createdAt: { type: Date, expires: "5m", default: Date.now },
});

export default mongoose.model("Otp", OtpSchema);
