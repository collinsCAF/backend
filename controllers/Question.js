const express = require('express');
const Question = require('../models/Questions');
const StaffQuestionTracker = require('../models/StaffQuestionTracker');
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
        // Check if the user is a staff member or super admin
        if (req.user.role !== 'staff' && req.user.role !== 'superadmin') {
            return res.status(403).json({
                message: 'Only staff and super admin can upload questions'
            });
        }

        const newQuestion = new Question({
            questionText,
            options,
            correctAnswer,
            answerDescription,
            category,
            uploadedBy: req.user.id
        });

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

// Route to answer a question
exports.answerQuestion = async (req, res) => {
    const { questionId, staffId } = req.body;

    try {
        // Update or create the tracker
        await StaffQuestionTracker.findOneAndUpdate(
            { staffId },
            { $addToSet: { questionsAnswered: { questionId } } },
            { upsert: true, new: true }
        );

        return res.status(200).json({
            message: 'Question answered successfully'
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Failed to record answered question',
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

// New function to get the count of questions uploaded by a staff member
exports.getQuestionCountByStaff = async (staffId) => {
    try {
        const count = await Question.countDocuments({ uploadedBy: staffId });
        return count;
    } catch (error) {
        console.error('Error getting question count:', error);
        return 0;
    }
}

// New function to get questions uploaded by a specific staff member
exports.getQuestionsByStaff = async (req, res) => {
    try {
        const staffId = req.params.staffId;
        const questions = await Question.find({ uploadedBy: staffId }).sort({ uploadedAt: -1 });
        res.status(200).json({ questions });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching questions', error: error.message });
    }
}

// Add this function to the existing file
exports.getStaffQuestionStats = async (req, res) => {
    try {
        const staffId = req.user.id; // Assuming the user ID is stored in the token

        const stats = await Question.aggregate([
            { $match: { uploadedBy: mongoose.Types.ObjectId(staffId) } },
            { $group: { 
                _id: "$category", 
                count: { $sum: 1 } 
            }},
            { $sort: { count: -1 } }
        ]);

        const totalQuestions = stats.reduce((sum, stat) => sum + stat.count, 0);

        res.status(200).json({
            message: 'Staff question statistics retrieved successfully',
            totalQuestions,
            categoryStats: stats
        });
    } catch (error) {
        console.error('Error in getStaffQuestionStats:', error);
        res.status(500).json({ message: 'Failed to retrieve question statistics', error: error.message });
    }
};

