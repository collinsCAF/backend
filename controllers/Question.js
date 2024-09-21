const express = require('express');
const Question = require('../models/Questions');
const router = express.Router();

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Route to upload a new question
exports.newQuestion = async (req, res) => {
    const {
        questionText,
        options,
        correctAnswer,
        answerDescription,
        category
    } = req.body;

    try {
        // Create a new question document using the Mongoose model
        const newQuestion = new Question({
            questionText,
            options,
            correctAnswer,
            answerDescription,
            category
        });

        // Save the question to the database
        await newQuestion.save();

        return res.status(201).json({
            message: 'Question uploaded successfully',
            question: newQuestion
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Failed to upload question',
            error: error.message
        });
    }
}


exports.getQuestionByCaterogies = async (req, res) => {
    const { category } = req.params;

    try {
        // Fetch questions by category and limit the result to 40
        let questions = await Question.find({ category })
            .limit(40)
            .exec();

        // Shuffle the questions
        questions = shuffleArray(questions);

        // Respond with the shuffled questions
        return res.status(200).json({
            message: 'Questions retrieved successfully',
            questions
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Failed to retrieve questions',
            error: error.message
        });
    }
}

