const express = require("express")
const router = express.Router()
const {signup, login,verifyOtp, forgetPassword , changePassword, signupAdmin} = require("../controllers/Auth")


router.post('/signup', signup);
router.post('/add-admin', signupAdmin);
router.post('/login', login);
router.post('/forget-password', forgetPassword);
router.post('/verify-otp', verifyOtp);
router.post('/change-password', changePassword);



module.exports = router;