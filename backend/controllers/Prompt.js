const PromptResponse = require('../models/PromptResponse');

// Create a new PromptResponse
exports.createPromptResponse = async (req, res) => {
    try {
        const  userid  = req.params.id; // User ID from params
        const { prompt, response } = req.body; // Prompt and response from request body

        if (!prompt) {
            return res.status(400).json({ message: 'Prompt is required.' });
        }

        const newPromptResponse = new PromptResponse({
            userId: userid,
            prompt,
            response,
        });

        const savedResponse = await newPromptResponse.save();

        res.status(201).json({ message: 'Prompt response created successfully.', data: savedResponse });
    } catch (err) {
        console.error('Error creating prompt response:', err);
        res.status(500).json({ message: 'An error occurred while creating the prompt response.' });
    }
};

// Get all PromptResponses by userId
exports.getPromptResponsesByUserId = async (req, res) => {
    try {
        const  userid  = req.params.id;

        const promptResponses = await PromptResponse.find({ userId: userid });

        if (!promptResponses || promptResponses.length === 0) {
            return res.status(404).json({ message: 'No prompt responses found for this user.' });
        }

        res.status(200).json({ message: 'Prompt responses retrieved successfully.', data: promptResponses });
    } catch (err) {
        console.error('Error fetching prompt responses:', err);
        res.status(500).json({ message: 'An error occurred while fetching the prompt responses.' });
    }
};

// Update the response in an existing PromptResponse
exports.updatePromptResponse = async (req, res) => {
    try {
        const id = req.params.id; // ID of the PromptResponse
        const { prompt, response } = req.body; // Updated prompt and response

        if (!prompt && !response) {
            return res.status(400).json({ message: 'At least one field (prompt or response) is required to update.' });
        }

        // Build the update object dynamically
        const updateData = {};
        if (prompt) updateData.prompt = prompt;
        if (response) updateData.response = response;

        const updatedResponse = await PromptResponse.findByIdAndUpdate(
            id,
            updateData,
            { new: true } // Return the updated document
        );

        if (!updatedResponse) {
            return res.status(404).json({ message: 'Prompt response not found.' });
        }

        res.status(200).json({ message: 'Prompt response updated successfully.', data: updatedResponse });
    } catch (err) {
        console.error('Error updating prompt response:', err);
        res.status(500).json({ message: 'An error occurred while updating the prompt response.' });
    }
};
