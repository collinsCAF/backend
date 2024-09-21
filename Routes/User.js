const express = require("express")
const router = express.Router()
const { signup, login } = require("../controllers/studentAuth")


router.post('/student-signup', signup)
router.post('/student-signin', login)


module.exports = router;