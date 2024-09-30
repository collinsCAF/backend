const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  logout,
  verifyOtp,
  forgetPassword,
  changePassword,
  getDashboardStats,
  toggleOTPRequirement,
  checkSuperAdmin,
  generateReferralLink,
  superAdminSignup,
  adminAddStaff  // Add this line to import adminAddStaff
} = require("../controllers/Auth");
const { isAuthenticated, isAdmin } = require("../middleware/auth");

// Public routes
router.post('/signup', signup);
router.post('/login', login);  // This will now handle both staff and super-admin logins
router.post('/logout', logout);
router.post('/verify-otp', verifyOtp);
router.post('/forget-password', forgetPassword);
router.post('/change-password', changePassword);

// Super Admin signup route
router.post('/super-admin-signup', superAdminSignup);

// Protected routes
router.get('/dashboard-stats', isAuthenticated, getDashboardStats);
router.post('/toggle-otp-requirement', isAuthenticated, toggleOTPRequirement);
router.post('/admin-add-staff', isAuthenticated, isAdmin, adminAddStaff);

// Additional route for checking super admin
router.post('/check-super-admin', checkSuperAdmin);

// New route for generating referral link
router.get('/referral-link', isAuthenticated, generateReferralLink);

module.exports = router;