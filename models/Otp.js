import mongoose from "mongoose";

const OtpSchema = mongoose.Schema({
  email: String,
  otp: String,
  createdAt: { type: Date, expires: "5m", default: Date.now },
});

export default mongoose.model("Otp", OtpSchema);
