const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema({
    userID: { type: String, required: true, unique: true },
    topic: { type: String, required: true, unique: true },
    completed: { type: Boolean, required: true },
});

const Progress = mongoose.model("Progress", progressSchema);
module.exports = Progress;
