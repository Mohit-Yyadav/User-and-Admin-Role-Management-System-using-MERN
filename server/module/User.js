const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      minlength: 6,
      default: null,
    },

    user: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },

    // LinkedIn OAuth
    linkedinId: {
      type: String,
      default: null,
      index: true,
    },

    // Profile
    profileImage: {
      type: String,
      default: "",
    },

    images: {
      type: [String],
      default: [],
    },

    // OTP system
    otp: {
      type: String,
      default: null,
    },

    otpExpires: {
      type: Date,
      default: null,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);