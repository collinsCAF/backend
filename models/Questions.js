const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
    questionText: {
        type: String,
        required: true,
    },
    options: {
        type: [
            {
                option: { type: String, required: true },
                optionLabel: { type: String, required: true }, // e.g., "Option A", "Option B"
            },
        ],
        validate: [optionsLimit, '{PATH} exceeds the limit of 4'], // Ensure only 4 options are present
        required: true,
    },
    correctAnswer: {
        type: String, // Store option label like 'Option A', 'Option B', etc.
        required: true,
    },
    answerDescription: {
        type: String,
        // required: true,
    },
    category: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'AddStaff', required: true },
    uploadedAt: { type: Date, default: Date.now }
});

// Custom validator to limit the number of options to 4
function optionsLimit(val) {
    return val.length === 4;
}

const Question = mongoose.model("Question", questionSchema);

module.exports = Question;
