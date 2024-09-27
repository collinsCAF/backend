const { generateOTP, sendOTP, sendStaffMessage } = require('../utils/otp')
const User = require("../models/User")
const AddStaff = require("../models/Staff")
const Question = require('../models/Questions');
const crypto = require('crypto');

// Modify the genericLogin function
const genericLogin = async (Model, role, req, res) => {
  const { email, password } = req.body;
  try {
    const user = await Model.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

    // Check if OTP verification is required
    if (user.requireOTP && user.OTP) {
      return res.status(200).json({ 
        message: 'OTP verification required',
        requireOTP: true,
        email: user.email
      });
    }

    // Set session data
    req.session.userId = user._id;
    req.session.role = user.role || role;

    res.status(200).json({ message: 'Login successful', role: user.role || role });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Modify the genericSignup function
const genericSignup = async (Model, role, req, res) => {
  const { name, email, password, confirmPassword, phoneNumber, school, requireOTP } = req.body;
  try {
    let user = await Model.findOne({ email });
    if (user) return res.status(400).json({ message: `${role} already exists` });

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    const OTP = requireOTP ? generateOTP() : null;
    if (requireOTP) {
      role === 'Staff' ? sendStaffMessage(email, password, OTP) : sendOTP(email, OTP);
    }
    const OTPCreatedTime = requireOTP ? new Date() : null;

    user = new Model({ name, email, password, phoneNumber, school, OTP, OTPCreatedTime, role, requireOTP });
    await user.save();

    res.status(201).json({ 
      message: `${role} created successfully. ${requireOTP ? 'Please verify your email.' : ''}`,
      requireOTP
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Generic resend OTP function
const genericResendOTP = async (Model, role, req, res) => {
  const { email } = req.body;
  try {
    const user = await Model.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const OTP = generateOTP();
    await sendOTP(email, OTP); // Add await here
    const OTPCreatedTime = new Date();

    user.OTP = OTP;
    user.OTPCreatedTime = OTPCreatedTime;
    await user.save();

    res.status(200).json({ message: `New OTP sent to ${role} email` });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error sending OTP. Please try again later.' });
  }
};

// Generic OTP verification function
const genericVerifyOtp = async (Model, role, req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await Model.findOne({ email });

    if (!user) return res.status(400).json({ message: 'Invalid email' });
    if (user.OTP !== otp) return res.status(400).json({ message: 'Invalid OTP' });

    const currentTime = new Date();
    const otpAge = (currentTime - user.OTPCreatedTime) / 1000; // age in seconds
    if (otpAge > 300) return res.status(400).json({ message: 'OTP expired' }); // OTP expires in 5 minutes (300 seconds)

    user.OTP = null;
    user.OTPCreatedTime = null;
    await user.save();

    res.status(200).json({ message: `${role} OTP verified successfully` });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update the existing verifyOtp function
exports.verifyOtp = (req, res) => genericVerifyOtp(User, 'User', req, res);

// Add new OTP verification functions for staff and super-admin
exports.verifyStaffOtp = (req, res) => genericVerifyOtp(AddStaff, 'Staff', req, res);
exports.verifySuperAdminOtp = (req, res) => genericVerifyOtp(AddStaff, 'SuperAdmin', req, res);

// Generic OTP verification
exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  const Model = email.includes('staff') ? AddStaff : User;

  try {
    const user = await Model.findOne({ email });

    if (!user) return res.status(400).json({ message: 'Invalid email' });
    if (user.OTP !== otp) return res.status(400).json({ message: 'Invalid OTP' });

    const currentTime = new Date();
    const otpAge = (currentTime - user.OTPCreatedTime) / 1000; // age in seconds
    if (otpAge > 300) return res.status(400).json({ message: 'OTP expired' }); // OTP expires in 5 minutes (300 seconds)

    user.OTP = null;
    user.OTPCreatedTime = null;
    await user.save();

    res.status(200).json({ message: 'OTP verified' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Remove the refreshToken function as it's no longer needed

exports.signup = (req, res) => genericSignup(User, 'User', req, res);
exports.studentSignup = (req, res) => genericSignup(User, 'Student', req, res);
exports.superAdminSignup = async (req, res) => {
  try {
    // Check if a super admin already exists
    const existingSuperAdmin = await AddStaff.findOne({ role: 'SuperAdmin' });
    if (existingSuperAdmin) {
      return res.status(403).json({ message: 'Super Admin already exists' });
    }

    // Proceed with super admin creation
    await genericSignup(AddStaff, 'SuperAdmin', req, res);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.adminAddStaff = (req, res) => genericSignup(AddStaff, 'Staff', req, res);

exports.login = (req, res) => genericLogin(User, 'User', req, res);
exports.studentLogin = (req, res) => genericLogin(User, 'Student', req, res);
exports.superAdminLogin = (req, res) => genericLogin(AddStaff, 'SuperAdmin', req, res);
exports.staffLogin = (req, res) => genericLogin(AddStaff, 'Staff', req, res);

exports.resendUserOtp = (req, res) => genericResendOTP(User, 'User', req, res);
exports.resendStaffOtp = (req, res) => genericResendOTP(AddStaff, 'Staff', req, res);
exports.resendSuperAdminOtp = (req, res) => genericResendOTP(AddStaff, 'SuperAdmin', req, res);

exports.forgetPassword = async (req, res) => {
  const { email } = req.body;
  const Model = email.includes('staff') ? AddStaff : User;

  try {
    const user = await Model.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email' });

    const OTP = generateOTP();
    sendOTP(email, OTP);
    const OTPCreatedTime = new Date();

    user.OTP = OTP;
    user.OTPCreatedTime = OTPCreatedTime;
    await user.save();

    res.status(200).json({ message: 'OTP sent to email' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.changePassword = async (req, res) => {
  const { email, otp, newPassword, confirmPassword } = req.body;
  const Model = email.includes('staff') ? AddStaff : User;

  try {
    const user = await Model.findOne({ email });

    if (!user) return res.status(400).json({ message: 'Invalid email' });
    if (user.OTP !== otp) return res.status(400).json({ message: 'Invalid OTP' });

    const currentTime = new Date();
    const otpAge = (currentTime - user.OTPCreatedTime) / 1000; // age in seconds
    if (otpAge > 300) return res.status(400).json({ message: 'OTP expired' }); // OTP expires in 5 minutes (300 seconds)

    if (newPassword !== confirmPassword) return res.status(400).json({ message: 'Passwords do not match' });

    user.password = newPassword;
    user.OTP = null;
    user.OTPCreatedTime = null;
    await user.save();

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const totalQuestions = await Question.countDocuments();
    const totalStudents = await User.countDocuments();
    const totalStaff = await AddStaff.countDocuments({ role: { $ne: 'superadmin' } });

    res.status(200).json({
      totalQuestions,
      totalStudents,
      totalStaff
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add a new function to toggle OTP requirement
exports.toggleOTPRequirement = async (req, res) => {
  const { email, requireOTP } = req.body;
  try {
    const user = await User.findOne({ email }) || await AddStaff.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    user.requireOTP = requireOTP;
    await user.save();

    res.status(200).json({ message: `OTP requirement ${requireOTP ? 'enabled' : 'disabled'} for user` });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Could not log out, please try again' });
    }
    res.status(200).json({ message: 'Logout successful' });
  });
};
