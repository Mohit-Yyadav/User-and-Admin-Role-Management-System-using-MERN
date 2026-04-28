const express = require("express");
const routes = express.Router();
const User = require("../module/User");
const { register, login, verifyOTP, getProfile, updateProfile, uploadProfileImage, uploadImages } = require("../controller/usercontroller");
const { getAllUsers, getUserById, updateUser, deleteUser } = require("../controller/admincontroller");
const { auth, adminAuth } = require("../middleware/auth");
const upload = require("../config/multer");

// User routes
routes.post("/register", register);
routes.post("/login", login);
routes.post("/verify-otp", verifyOTP);

// Protected user routes
routes.get("/profile", auth, getProfile);
routes.put("/profile", auth, updateProfile);
routes.post("/upload-profile-image", auth, upload.single('profileImage'), uploadProfileImage);
routes.post("/upload-images", auth, upload.array('images', 10), uploadImages); // Allow up to 10 images

// Admin routes
routes.get("/admin/users", auth, adminAuth, getAllUsers);
routes.get("/admin/users/:id", auth, adminAuth, getUserById);
routes.put("/admin/users/:id", auth, adminAuth, updateUser);
routes.delete("/admin/users/:id", auth, adminAuth, deleteUser);




module.exports = routes;