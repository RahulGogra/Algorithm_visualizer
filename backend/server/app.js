const express = require("express");
const session = require("express-session");
const cors = require("cors");
const app = express();
const dotenv = require("dotenv");
require("colors");
const connectDB = require("../db/connect");
const Users = require("../modals/userModal");
const Progress = require("../modals/progressModal");

app.use(cors());
app.use(express.json());

dotenv.config();
connectDB();

app.post("/user/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user exists
        const user = await Users.findOne({ email });
        if (!user) {
            return res
                .status(400)
                .json({ message: "Invalid email or password" });
        }

        // Compare passwords
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res
                .status(400)
                .json({ message: "Invalid email or password" });
        }

        // Successful login
        res.status(200).json({
            message: "Login successful",
            user: user.username,
            email: user.email,
            userID: user._id,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

app.post("/user/register", async (req, res) => {
    const user = await Users.create(req.body);
    res.status(201).json({
        user: user.username,
        email: user.email,
        userID: user._id,
    });
});

app.post("/graph/bfs", async (req, res) => {
    const progress = await Progress.create(req.body);
    res.status(201).json({ progress });
});

app.get("/user/progress", async (req, res) => {
    try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        const topics = await Progress.find({ userID: userInfo.userID }); // Fetch all items
        res.json(topics);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

const port = process.env.PORT || 5000;
app.listen(port, console.log(`server listening on ${port}`.blue.bold));
