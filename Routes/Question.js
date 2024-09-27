const express = require("express")
const router = express.Router()
const { 
    newQuestion, 
    getQuestionByCaterogies, 
    answerQuestion, 
    getQuestionsByStaff,
    getStaffQuestionStats // Add this line
} = require("../controllers/Question")
const { isAuthenticated, isStaffOrAdmin } = require("../middleware/auth")

router.post('/upload-question', isAuthenticated, isStaffOrAdmin, newQuestion)
router.get('/questions/:category', getQuestionByCaterogies)
router.post('/answer-question', isAuthenticated, answerQuestion)
router.get('/staff-questions/:staffId', isAuthenticated, isStaffOrAdmin, getQuestionsByStaff)
router.get('/staff-question-stats', isAuthenticated, isStaffOrAdmin, getStaffQuestionStats);

module.exports = router;