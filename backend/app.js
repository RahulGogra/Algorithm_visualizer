const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./db/connect");
const Users = require("./modals/userModal");
const Progress = require("./modals/progressModal");
const helmet = require("helmet");
require("colors");

dotenv.config();
const app = express();
app.use(
    cors({
        origin: "*", // Frontend origin
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true, // Allow credentials (cookies, sessions, etc.)
    }),
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", "'unsafe-inline'", "https://vercel.live"],
                connectSrc: ["'self'", "https://vercel.live"],
            },
        },
    })
);
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
    res.send("Hello, World!");
});

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

        res.status(200).json({
            message: "Login successful",
            user: user.username,
            email: user.email,
            userID: user.userID,
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

// Route to submit progress (BFS graph traversal example)
app.post("/user/topic", async (req, res) => {
    try {
        const { userID, topic, completed } = req.body;

        // Ensure the user is logged in
        if (!userID) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        // Check if the user already has progress saved
        let userProgress = await Progress.findOne({ userID });

        if (userProgress) {
            // Check if the topic already exists in the user's topics
            const existingTopic = userProgress.topics.find(
                (t) => t.topic === topic
            );

            if (existingTopic) {
                // If the topic exists, update the completion status
                existingTopic.completed = completed;
            } else {
                // If the topic doesn't exist, add it to the topics array
                userProgress.topics.push({ topic, completed });
            }

            // Save the updated progress
            await userProgress.save();
            res.status(200).json({
                message: "Progress updated successfully",
                progress: userProgress,
            });
        } else {
            // If no progress exists for the user, create a new entry
            const newProgress = new Progress({
                userID,
                topics: [{ topic, completed }],
            });

            // Save the new progress
            await newProgress.save();
            res.status(201).json({
                message: "Progress created successfully",
                progress: newProgress,
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

// Route to get user's progress
app.get("/user/progress", async (req, res) => {
    try {
        const userID = req.query.userID;

        // Ensure the user is logged in
        if (!userID) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        // Fetch the user's progress from the database
        const userProgress = await Progress.findOne({ userID: userID });

        // If no progress data found for the user
        if (!userProgress) {
            return res
                .status(404)
                .json({ message: "Progress not found for this user" });
        }

        // Send the user's topics array
        res.json(userProgress.topics);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Logout route
app.post("/user/logout", (req, res) => {
    // Destroy the session
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: "Logout failed" });
        }

        res.status(200).json({ message: "Logout successful" });
    });
});

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server listening on ${port}`.blue.bold));
