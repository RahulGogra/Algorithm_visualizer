/* eslint-disable no-undef */
const mongoose = require("mongoose");

const topicSchema = new mongoose.Schema({
    topic: { type: String, required: true },
    completed: { type: Boolean, required: true },
});

const progressSchema = new mongoose.Schema({
    userID: { type: String, required: true }, // userID for each user
    topics: [topicSchema], // Array of topics with completion status
});

const Progress = mongoose.model("Progress", progressSchema);
module.exports = Progress;
