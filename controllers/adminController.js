const User = require("../models/User");
const Question = require("../models/Questions");
const StaffQuestionTracker = require("../models/StaffQuestionTracker");

exports.superAdminDashboard = async (req, res) => {
    try {
        // Total number of questions
        const totalQuestions = await Question.countDocuments();

        
        // Total number of users
        const totalUsers = await User.countDocuments();

        // Questions uploaded in the last 24 hours
        const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const recentQuestions = await Question.countDocuments({ uploadedAt: { $gte: last24Hours } });

        // Top 5 users who uploaded the most questions
        const topUploaders = await Question.aggregate([
            { $group: { _id: "$uploadedBy", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 },
            { $lookup: { from: "addstaffs", localField: "_id", foreignField: "_id", as: "user" } },
            { $unwind: "$user" },
            { $project: { _id: 1, count: 1, name: "$user.name", email: "$user.email" } }
        ]);

        // Questions by category
        const questionsByCategory = await Question.aggregate([
            { $group: { _id: "$category", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        // Total number of questions answered
        const totalAnswered = await StaffQuestionTracker.aggregate([
            { $unwind: "$questionsAnswered" },
            { $group: { _id: null, count: { $sum: 1 } } }
        ]);

        res.status(200).json({
            totalQuestions,
            totalUsers,
            recentQuestions,
            topUploaders,
            questionsByCategory,
            totalAnswered: totalAnswered[0] ? totalAnswered[0].count : 0
        });
    } catch (error) {
        console.error('Error in superAdminDashboard:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};