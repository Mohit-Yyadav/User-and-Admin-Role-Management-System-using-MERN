const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require("../module/User");
const { sendOTPEmail } = require('../utils/email');

// Register
exports.register = async (req, res) => {
    try {
        const { name, email, password, user } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: "Please provide name, email, and password" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = crypto.randomInt(100000, 999999).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            user: user || 'user',
            otp,
            otpExpires
        });

        await newUser.save();

        // Send OTP email
        await sendOTPEmail(email, otp);

        res.status(201).json({
            message: "User registered successfully. Please check your email for OTP verification.",
            userId: newUser._id
        });
    } catch (err) {
        console.error("Error registering user:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Verify OTP
exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ error: "Please provide email and OTP" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }

        if (user.isVerified) {
            return res.status(400).json({ error: "User already verified" });
        }

        if (user.otp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ error: "Invalid or expired OTP" });
        }

        user.isVerified = true;
        user.otp = null;
        user.otpExpires = null;
        await user.save();

        res.status(200).json({ message: "Email verified successfully" });
    } catch (err) {
        console.error("Error verifying OTP:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Please provide email and password" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        if (!user.isVerified) {
            return res.status(400).json({ error: "Please verify your email first" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email, userType: user.user },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '7d' }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                userType: user.user,
                profileImage: user.profileImage,
                images: user.images
            }
        });
    } catch (err) {
        console.error("Error logging in:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Get user profile
exports.getProfile = async (req, res) => {
    try {
        const user = req.user;
        res.status(200).json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                userType: user.user,
                profileImage: user.profileImage,
                images: user.images
            }
        });
    } catch (err) {
        console.error("Error getting profile:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Update user profile
exports.updateProfile = async (req, res) => {
    try {
        const { name, email } = req.body;
        const user = req.user;

        if (name) user.name = name;
        if (email) {
            const existingUser = await User.findOne({ email, _id: { $ne: user._id } });
            if (existingUser) {
                return res.status(400).json({ error: "Email already exists" });
            }
            user.email = email;
        }

        await user.save();

        res.status(200).json({
            message: "Profile updated successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                userType: user.user,
                profileImage: user.profileImage,
                images: user.images
            }
        });
    } catch (err) {
        console.error("Error updating profile:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Upload profile image
exports.uploadProfileImage = async (req, res) => {
    try {
        const user = req.user;
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        user.profileImage = `/uploads/${req.file.filename}`;
        await user.save();

        res.status(200).json({
            message: "Profile image uploaded successfully",
            profileImage: user.profileImage
        });
    } catch (err) {
        console.error("Error uploading profile image:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Upload multiple images
exports.uploadImages = async (req, res) => {
    try {
        const user = req.user;
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: "No files uploaded" });
        }

        const imageUrls = req.files.map(file => `/uploads/${file.filename}`);
        user.images = user.images || [];
        user.images.push(...imageUrls);
        await user.save();

        res.status(200).json({
            message: "Images uploaded successfully",
            images: user.images
        });
    } catch (err) {
        console.error("Error uploading images:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};






