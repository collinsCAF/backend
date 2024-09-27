const express = require("express")
const router = express.Router()
const {
  signup,
  login,
  logout,
  verifyOtp,
  verifyStaffOtp,
  verifySuperAdminOtp,
  resendUserOtp,
  resendStaffOtp,
  resendSuperAdminOtp,
  forgetPassword,
  changePassword,
  superAdminSignup,
  superAdminLogin,
  adminAddStaff,
  staffLogin,
  studentSignup,
  studentLogin,
  getDashboardStats,
  toggleOTPRequirement
} = require("../controllers/Auth")

const authMiddleware = require('../middleware/auth');

router.post('/signup', signup)
router.post('/login', login)
router.post('/verify-otp', verifyOtp)
router.post('/verify-staff-otp', verifyStaffOtp)
router.post('/verify-super-admin-otp', verifySuperAdminOtp)
router.post('/forget-password', forgetPassword)
router.post('/change-password', changePassword)
router.post('/super-admin-signup', superAdminSignup) // Removed authMiddleware
router.post('/super-admin-login', superAdminLogin)
router.post('/admin-add-staff', authMiddleware, adminAddStaff)
router.post('/staff-login', staffLogin)
router.post('/student-signup', studentSignup)
router.post('/student-login', studentLogin)

router.get('/dashboard-stats', getDashboardStats)

router.post('/resend-user-otp', resendUserOtp)
router.post('/resend-staff-otp', resendStaffOtp)
router.post('/resend-super-admin-otp', resendSuperAdminOtp)
router.post('/toggle-otp-requirement', authMiddleware, toggleOTPRequirement)

// Remove the refresh token route
// router.post('/refresh-token', refreshToken)

router.post('/logout', logout)

module.exports = router;