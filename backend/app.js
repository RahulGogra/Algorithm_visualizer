/* eslint-disable no-undef */
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./db/connect");
const Users = require("./modals/userModal");
const Progress = require("./modals/progressModal");
require("colors");

dotenv.config();
const app = express();

// CORS configuration
app.use(
    cors({
        origin: [
            "http://localhost:5173", // Your React app's URL
            "https://algorithm-visualizer-api.onrender.com",
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

        // Debug: Log incoming request data
        console.log("Request body:", { userID, topic, completed });

        if (!userID || !topic || typeof completed === "undefined") {
            return res.status(400).json({ message: "Invalid input data" });
        }

        // Check if progress already exists for the user
        let userProgress = await Progress.findOne({ userID });

        if (userProgress) {
            // Find the existing topic
            const existingTopic = userProgress.topics.find(
                (t) => t.topic === topic
            );

            if (existingTopic) {
                existingTopic.completed = completed; // Update completion status
            } else {
                userProgress.topics.push({ topic, completed }); // Add new topic
            }

            // Save updated progress
            await userProgress.save();
            res.status(200).json({
                message: "Progress updated successfully",
                progress: userProgress,
            });
        } else {
            // Create new progress document
            const newProgress = new Progress({
                userID,
                topics: [{ topic, completed }],
            });

            await newProgress.save();
            res.status(201).json({
                message: "Progress created successfully",
                progress: newProgress,
            });
        }
    } catch (error) {
        console.error("Server error:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Route to get user's progress
app.get("/user/progress", async (req, res) => {
    try {
        const userID = req.query.userID;

        if (!userID) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        const userProgress = await Progress.findOne({ userID });

        if (!userProgress) {
            return res
                .status(404)
                .json({ message: "Progress not found for this user" });
        }

        res.json(userProgress.topics);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Logout route
app.post("/user/logout", (req, res) => {
    res.status(200).json({ message: "Logout successful" });
});

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server listening on ${port}`.blue.bold));
