const express = require("express")
const router = express.Router()

const { newQuestion, getQuestionByCaterogies } = require("../controllers/Question")


router.post('/upload-question', newQuestion)
router.get('/questions/:category', getQuestionByCaterogies)


module.exports = router;