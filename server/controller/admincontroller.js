const User = require("../module/User");

// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, '-password -otp -otpExpires'); // Exclude sensitive fields
        res.status(200).json({ users });
    } catch (err) {
        console.error("Error getting all users:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Get user by ID
exports.getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id, '-password -otp -otpExpires');
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json({ user });
    } catch (err) {
        console.error("Error getting user by ID:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Update user
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, user: userType } = req.body;

        const updateData = {};
        if (name) updateData.name = name;
        if (email) {
            const existingUser = await User.findOne({ email, _id: { $ne: id } });
            if (existingUser) {
                return res.status(400).json({ error: "Email already exists" });
            }
            updateData.email = email;
        }
        if (userType) updateData.user = userType;

        const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true, select: '-password -otp -otpExpires' });
        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({
            message: "User updated successfully",
            user: updatedUser
        });
    } catch (err) {
        console.error("Error updating user:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Delete user
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({ message: "User deleted successfully" });
    } catch (err) {
        console.error("Error deleting user:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};
