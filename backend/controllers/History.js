const History = require('../models/UserHistory')

const UserHistory = require('../models/UserHistory');


exports.createSession = async (req, res) => {
    try {
        const userId = req.params.id; // User ID from params
        const { experience, language, expertise } = req.body;

        // Validate required fields
        if (!experience || !language || !expertise) {
            return res.status(400).json({ message: 'All fields (experience, language, expertise) are required.' });
        }

        // Create a new session history entry
        const newSession = new UserHistory({
            userId,
            experience,
            language,
            expertise,
        });

        // Save to database
        await newSession.save();

        res.status(201).json({
            message: 'Session history created successfully.',
            data: newSession,
        });
    } catch (err) {
        console.error('Error creating session history:', err);
        res.status(500).json({ message: 'An error occurred while creating the session history.' });
    }
};


exports.getSessionByID = async (req, res) => {
    try {
        const userId = req.params.id; // User ID from params

        // Find session history entries for the given user ID
        const sessions = await UserHistory.find({ userId });

        if (!sessions || sessions.length === 0) {
            return res.status(404).json({ message: 'No session history found for the specified user.' });
        }

        res.status(200).json({
            message: 'Session history retrieved successfully.',
            data: sessions,
        });
    } catch (err) {
        console.error('Error fetching session history:', err);
        res.status(500).json({ message: 'An error occurred while fetching the session history.' });
    }
};
