import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  username: {
    type: String,
    trim: true,
    require: true,
  },
  email: {
    type: String,
    trim: true,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
    min: 6,
    max: 64,
  },
  isVerified: {
    type: "Boolean",
    default: false,
  },
  role: {
    type: String,
    default: "user",
    enum: ["user", "admin", "seller"],
  },
  tokenVersion: {
    type: Number,
    default: 0,
  },
});

const User = mongoose.model("User", userSchema);

export default User;
