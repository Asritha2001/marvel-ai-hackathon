const User = require('../models/User');
const mongoose = require('mongoose'); // For ObjectId validation

// Signup API
exports.signup = async (req, res) => {
    try {
        const { username, email, password, experience, preferredLanguages, learningGoals } = req.body;

        // Validation
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Username, email, and password are required.' });
        }

        // Check if username or email already exists
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Username or email already exists.' });
        }

        // Create a new user
        const newUser = new User({
            username,
            email,
            password, // Password stored as plain text (not recommended for production)
            experience,
            preferredLanguages,
            learningGoals,
        });

        // Save user to database
        await newUser.save();

        // Respond with success
        res.status(201).json({
            message: 'User signed up successfully',
            user: newUser,
        });
    } catch (err) {
        console.error('Error during signup:', err);
        res.status(500).json({ message: 'An error occurred during signup.' });
    }
};

// Login API
exports.login = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validation
        if ((!username && !email) || !password) {
            return res.status(400).json({ message: 'Username/email and password are required.' });
        }

        // Find user by username or email
        const user = await User.findOne({ $or: [{ username }, { email }] });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Check password
        if (user.password !== password) {
            return res.status(401).json({ message: 'Invalid password.' });
        }

        // Respond with user data
        res.status(200).json({
            message: 'Login successful',
            user,
        });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ message: 'An error occurred during login.' });
    }
};

// Get User Data API
exports.getUserData = async (req, res) => {
    try {
        const  userid = req.params.id;        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(userid)) {
            return res.status(400).json({ message: 'Invalid user ID.' });
        }

        // Find user by ID
        const user = await User.findById(userid);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Respond with user data
        res.status(200).json({
            message: 'User data retrieved successfully',
            user,
        });
    } catch (err) {
        console.error('Error fetching user data:', err);
        res.status(500).json({ message: 'An error occurred while fetching user data.' });
    }
};

// Update User Data API
exports.updateUserData = async (req, res) => {
    try {
        const  userid  = req.params.id;
        const updates = req.body; // Contains the fields to update

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(userid)) {
            return res.status(400).json({ message: 'Invalid user ID.' });
        }

        // Find and update user
        const user = await User.findByIdAndUpdate(userid, updates, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Respond with updated user data
        res.status(200).json({
            message: 'User data updated successfully',
            user,
        });
    } catch (err) {
        console.error('Error updating user data:', err);
        res.status(500).json({ message: 'An error occurred while updating user data.' });
    }
};
