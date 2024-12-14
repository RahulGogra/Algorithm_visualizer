/* eslint-disable no-undef */
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./db/connect");
const Users = require("./modals/userModal");
const Topic = require("./modals/topicModal");
const Progress = require("./modals/progressModal");
require("colors");

dotenv.config();
const app = express();

// CORS configuration
app.use(
    cors({
        origin: [
            "*",
            "http://localhost:5173", // Your React app's URL
            "https://algorithm-visualizer-api.onrender.com",
            "https://algorithm-visualizer-umber.vercel.app/",
        ],
        credentials: true, // Allow credentials (cookies, sessions, etc.)
    })
);

// Handle preflight requests for all routes
app.options("*", cors());

// Middleware
app.use(express.json());

// Connect to database
connectDB();

// User login route
app.post("/user/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await Users.findOne({ email });
        if (!user || !(await user.matchPassword(password))) {
            return res
                .status(400)
                .json({ message: "Invalid email or password" });
        }

        console.log(user.email);
        res.status(200).json({
            message: "Login successful",
            userID: user._id,
            user: user.username,
            email: user.email,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

// User registration route
app.post("/user/register", async (req, res) => {
    try {
        const user = await Users.create(req.body);

        res.status(201).json({
            user: user.username,
            email: user.email,
            userID: user._id,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

// Route to submit progress
app.post("/user/topic", async (req, res) => {
    try {
        const { userID, topic, completed } = req.body;

        if (!userID || !topic) {
            return res
                .status(400)
                .json({ message: "User ID and topic are required" });
        }

        // Check if the topic already exists for the user
        let existingTopic = await Topic.findOne({ userID, topic });

        if (existingTopic) {
            // Update completion status
            existingTopic.completed = completed;
            await existingTopic.save();
            return res.status(200).json({
                message: "Topic updated successfully",
                topic: existingTopic,
            });
        }

        // Create a new topic
        const newTopic = new Topic({ userID, topic, completed });
        await newTopic.save();

        res.status(201).json({
            message: "Topic created successfully",
            topic: newTopic,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

// Route to get user's progress
app.get("/user/progress", async (req, res) => {
    try {
        const { userID } = req.query;

        if (!userID) {
            return res.status(400).json({ message: "User ID is required" });
        }

        // Find all topics for the user
        const topics = await Topic.find({ userID });

        if (!topics.length) {
            return res
                .status(404)
                .json({ message: "No progress found for this user" });
        }

        res.status(200).json({ topics });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

// Logout route
app.post("/user/logout", (req, res) => {
    res.status(200).json({ message: "Logout successful" });
});

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server listening on ${port}`.blue.bold));
