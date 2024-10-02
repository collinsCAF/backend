const express = require("express")
const router = express.Router()
const {
    newQuestion,
    getQuestionByCaterogies,
    answerQuestion,
    getQuestionsByStaff,
    getStaffQuestionStats,
    getStaffQuestionsList // Add this line
} = require("../controllers/Question")
const { isAuthenticated, isStaffOrAdmin, isSuperAdmin } = require("../middleware/auth")




router.post('/upload-question', isAuthenticated, isStaffOrAdmin, newQuestion)
router.get('/questions/:category', getQuestionByCaterogies)
router.post('/answer-question', isAuthenticated, answerQuestion)
router.get('/staff-questions/:staffId', isAuthenticated, isStaffOrAdmin, getQuestionsByStaff)
router.get('/staff-question-stats', isAuthenticated, isStaffOrAdmin, getStaffQuestionStats)
router.get('/staff-questions-list', isAuthenticated, isSuperAdmin, getStaffQuestionsList);

module.exports = router;