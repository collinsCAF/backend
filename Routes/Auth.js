const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  staffLogin,
  superAdminLogin,
  superAdminSignup,
  adminAddStaff,
  logout,
  verifyOtp,
  forgetPassword,
  changePassword,
  getDashboardStats,
  toggleOTPRequirement,
  checkSuperAdmin,
  generateReferralLink  // Add this line
} = require("../controllers/Auth");
const { isAuthenticated, isAdmin } = require("../middleware/auth");

// Public routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/staff-login', staffLogin);
router.post('/super-admin-login', superAdminLogin);
router.post('/super-admin-signup', superAdminSignup);
router.post('/logout', logout);
router.post('/verify-otp', verifyOtp);
router.post('/forget-password', forgetPassword);
router.post('/change-password', changePassword);

// Protected routes
router.get('/dashboard-stats', isAuthenticated, getDashboardStats);
router.post('/toggle-otp-requirement', isAuthenticated, toggleOTPRequirement);
router.post('/admin-add-staff', isAuthenticated, isAdmin, adminAddStaff);

// Additional route for checking super admin
router.post('/check-super-admin', checkSuperAdmin);

// New route for generating referral link
router.get('/referral-link', isAuthenticated, generateReferralLink);

module.exports = router;