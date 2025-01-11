const UserSchema = require('../models/User');

exports.createUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required.' });
        }

        
        const newUser = new UserSchema({
            username,
            password
        });

        
        await newUser.save();

        
        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (err) {
        
        console.error('Error creating user:', err);
        res.status(500).json({ message: 'An error occurred while creating the user.' });
    }
};
