const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema(
    {
        userID: {
            type: String,
            required: [true, "User ID is required"],
            unique: true, // Ensures one document per user
            trim: true,
        },
    },
    { timestamps: true }
); // Adds createdAt and updatedAt fields

const Progress = mongoose.model("Progress", progressSchema);
module.exports = Progress;
