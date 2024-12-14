/* eslint-disable no-undef */
const mongoose = require("mongoose");

const topicSchema = new mongoose.Schema(
    {
        userID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // Refers to the User schema
            required: [true, "User ID is required"],
        },
        topic: {
            type: String,
            required: [true, "Topic is required"],
            trim: true,
        },
        completed: {
            type: Boolean,
            default: false, // Defaults to incomplete
        },
    },
    { timestamps: true }
); // Adds createdAt and updatedAt fields

const Topic = mongoose.model("Topic", topicSchema);
module.exports = Topic;
