const PromptResponse = require('../models/PromptResponse');
const User = require('../models/User');
const axios = require("axios"); // For API calls
const { GoogleGenerativeAI } = require("@google/generative-ai");
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const UserHistory = require('../models/UserHistory');

exports.processUserDataWithGemini = async (req, res) => {
    try {
        const userId = req.params.id;
        console.log(`Processing request for user ID: ${userId}`);

        // Fetch user data from the database
        const userData = await User.findById(userId);
        if (!userData) {
            return res.status(404).json({ message: "User not found" });
        }

        // Fetch user history records
        const userHistories = await UserHistory.find({ userId });
        let historyPrompt = "";

        if (userHistories.length > 0) {
            // Construct the dynamic historyPrompt using all user history records
            userHistories.forEach((history, index) => {
                historyPrompt += `Hi, my name is ${userData.username}. I have ${history.experience} level experience in ${history.language}, and my specialty is ${history.expertise}.`;
                if (index < userHistories.length - 1) {
                    historyPrompt += " "; // Add space between entries
                }
            });
        } else {
            historyPrompt = `Hi, my name is ${userData.username}. I don't have any prior recorded history in the system.`;
        }

        // Fetch API key for Gemini
        const geminiApiKey = process.env.GEMINI_API_KEY;
        if (!geminiApiKey) {
            throw new Error("Gemini API key is not set in the environment variables.");
        }

        const genAI = new GoogleGenerativeAI(geminiApiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Construct the initial prompt based on user's experience, language, and learning goals
        let initialPrompt = `I am a ${userData.experience} in ${userData.preferredLanguages}. I want to achieve ${userData.learningGoals}. 
                            You are a teacher who guides the user into learning by providing coding challenges and insights based on the user inputs. 
                            Please provide a beginner-friendly coding challenge and explain how it helps them progress.`;

        // Get the user input prompt from request body
        const userInput = req.body.prompt || "";

        // Combine historyPrompt, initialPrompt, and userInput
        const properInitialPrompt = historyPrompt + " " + initialPrompt + " " + userInput;

        // Fetch all existing prompt responses for this user
        const allPromptResponses = await PromptResponse.find({ userId });

        // Check if completedLesson is present in the request body
        if (req.body.completedLesson !== undefined) {
            const mostRecentResponse = allPromptResponses
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

            if (mostRecentResponse) {
                // Update the completedLesson, prompt, and response fields
                const result = await model.generateContent(properInitialPrompt);
                const geminiResponseText = result.response.text();

                mostRecentResponse.completedLesson = req.body.completedLesson;
                mostRecentResponse.prompt = properInitialPrompt;
                mostRecentResponse.response = geminiResponseText;

                await mostRecentResponse.save();
                console.log(`Updated prompt, response, and completedLesson for user ID: ${userId}`);

                return res.status(200).json({
                    result: geminiResponseText, // Return the updated AI response
                });
            }
        }

        // Check if all past records for the user have completedLesson = true
        const allCompleted = allPromptResponses.every((response) => response.completedLesson);

        if (allCompleted || allPromptResponses.length === 0) {
            // Create a new record since all lessons are completed or there are no records
            const result = await model.generateContent(properInitialPrompt);
            const geminiResponseText = result.response.text(); // Get response from Gemini AI

            const newPromptResponse = new PromptResponse({
                userId,
                prompt: properInitialPrompt, // Use the combined historyPrompt, initialPrompt, and userInput
                response: geminiResponseText, // Always store the AI's response
            });

            await newPromptResponse.save();
            console.log(`New prompt created for user ID: ${userId} as all past lessons were completed or no records exist.`);

            return res.status(200).json({
                result: geminiResponseText, // Return the AI response
            });
        } else {
            // Find the most recent incomplete lesson
            const recentIncompleteLesson = allPromptResponses
                .filter((response) => !response.completedLesson)
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

            if (recentIncompleteLesson) {
                // Update the existing record by appending the user input
                recentIncompleteLesson.prompt += " " + userInput;

                // Generate AI response
                const result = await model.generateContent(recentIncompleteLesson.prompt);
                const geminiResponseText = result.response.text();

                // Update the response field
                recentIncompleteLesson.response = geminiResponseText;

                // Save the updated record
                await recentIncompleteLesson.save();
                console.log(`Updated prompt for user ID: ${userId} with new user input.`);

                return res.status(200).json({
                    result: geminiResponseText, // Return the updated AI response
                });
            }
        }
    } catch (error) {
        console.error("Error processing user prompt:", error);
        return res.status(500).json({
            message: "An error occurred while processing the request.",
            error: error.message,
        });
    }
};



exports.getPromptResponsesByUser = async (req, res) => {
    try {
        const userId = req.params.id;

        // Find all prompt responses for the given userId, sorted by creation date (most recent first)
        const promptResponses = await PromptResponse.find({ userId }).sort({ createdAt: -1 });

        // Check if any records are found
        if (!promptResponses || promptResponses.length === 0) {
            return res.status(404).json({
                message: "No prompt responses found for this user.",
            });
        }

        // Return the found records
        return res.status(200).json({
            message: "Prompt responses retrieved successfully.",
            data: promptResponses,
        });
    } catch (error) {
        console.error("Error fetching prompt responses:", error);

        // Handle server error
        return res.status(500).json({
            message: "An error occurred while fetching the prompt responses.",
            error: error.message,
        });
    }
};
