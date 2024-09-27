const jwt = require('jsonwebtoken');
const { generateOTP, sendOTP } = require('../utils/otp');
const User = require("../models/User");
const AddStaff = require("../models/Staff");
const Question = require('../models/Questions');

const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.SECRET_KEY, { expiresIn: '1d' });
};

exports.signup = async (req, res) => {
  const { name, email, password, phoneNumber, school, referralCode } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User Details have already been used' });

    let referrer = null;
    if (referralCode) {
      referrer = await User.findOne({ email: referralCode });
      if (!referrer) {
        return res.status(400).json({ message: 'Invalid referral code' });
      }
    }

    const OTP = generateOTP();
    // sendOTP(email, OTP);
    const OTPCreatedTime = new Date();

    user = new User({ 
      name, 
      email, 
      password, 
      phoneNumber, 
      school, 
      OTP, 
      OTPCreatedTime,
      referredBy: referrer ? referrer._id : null
    });
    await user.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user);
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.staffLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const staff = await AddStaff.findOne({ email });
    if (!staff) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await staff.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(staff);
    res.status(200).json({ message: 'Staff login successful', token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.superAdminLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const superAdmin = await AddStaff.findOne({ email, role: 'superadmin' });
    if (!superAdmin) {
      console.log(`No super admin found with email: ${email}`);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await superAdmin.comparePassword(password);
    if (!isMatch) {
      console.log(`Password mismatch for super admin: ${email}`);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(superAdmin);
    res.status(200).json({ message: 'Super admin login successful', token });
  } catch (error) {
    console.error('Error in superAdminLogin:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.logout = (req, res) => {
  // With JWT, logout is typically handled on the client-side
  res.status(200).json({ message: 'Logout successful' });
};

exports.verifyOtp = async (req, res) => {
  // Implement OTP verification logic here
};

exports.forgetPassword = async (req, res) => {
  // Implement forget password logic here
};

exports.changePassword = async (req, res) => {
  // Implement change password logic here
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

exports.superAdminSignup = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  try {
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }
    
    let superAdmin = await AddStaff.findOne({ email });
    if (superAdmin) {
      return res.status(400).json({ message: 'Super Admin already exists' });
    }

    superAdmin = new AddStaff({ name, email, password, role: 'superadmin' });
    await superAdmin.save();

    // After successful signup, don't generate token
    res.status(201).json({ message: 'Super Admin created successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.adminAddStaff = async (req, res) => {
  const { name, email, password, confirmPassword, role } = req.body;
  try {
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }
    
    let staff = await AddStaff.findOne({ email });
    if (staff) {
      return res.status(400).json({ message: 'Staff member already exists' });
    }

    staff = new AddStaff({ name, email, password, role });
    await staff.save();

    res.status(201).json({ message: 'Staff member added successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.checkSuperAdmin = async (req, res) => {
  const { email } = req.body;
  try {
    const superAdmin = await AddStaff.findOne({ email });
    if (!superAdmin) {
      return res.status(404).json({ message: 'Super admin not found' });
    }
    res.status(200).json({
      message: 'Super admin found',
      role: superAdmin.role,
      hasPassword: !!superAdmin.password
    });
  } catch (error) {
    console.error('Error in checkSuperAdmin:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.generateReferralLink = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming you have user info in req.user after authentication
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const referralLink = `${process.env.FRONTEND_URL}/signup?ref=${user.email}`;
    res.status(200).json({ referralLink });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
};
