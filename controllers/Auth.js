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
    // First, check if it's a staff or super-admin
    let user = await AddStaff.findOne({ email });
    let userType = 'staff';
    
    // If not found in AddStaff, check in User model (for students/regular users)
    if (!user) {
      user = await User.findOne({ email });
      userType = 'user';
    }

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user);
    res.status(200).json({ 
      message: 'Login successful', 
      token,
      role: userType === 'staff' ? user.role : 'user',
      userType, // 'user' for students/regular users, 'staff' for staff and super_admin
      name: user.name,
      email: user.email
    });
  } catch (error) {
    console.error('Login error:', error);
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
  try {
    const { name, email, password } = req.body;

    // Check if a super admin already exists
    const existingSuperAdmin = await Staff.findOne({ role: 'super_admin' });
    if (existingSuperAdmin) {
      return res.status(400).json({ message: 'A super admin already exists' });
    }

    // Create a new staff member with super_admin role
    const newSuperAdmin = new Staff({
      name,
      email,
      password,
      role: 'super_admin'
    });

    await newSuperAdmin.save();

    res.status(201).json({ message: 'Super admin created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating super admin' });
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
