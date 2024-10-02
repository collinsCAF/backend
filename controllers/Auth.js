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

exports.userLogin = async (req, res) => {
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
    res.status(200).json({ 
      message: 'Login successful', 
      token,
      role: 'user',
      userType: 'user',
      name: user.name,
      email: user.email
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.staffLogin = async (req, res) => {
  try {
    // Parse the request body if it's a string
    let body = req.body;
    if (typeof body === 'object' && Object.keys(body).length === 1) {
      const key = Object.keys(body)[0];
      try {
        body = JSON.parse(key);
      } catch (e) {
        console.error('Error parsing request body:', e);
      }
    }

    console.log('Parsed body:', body);

    const { email, password } = body;

    console.log('Attempting login with email:', email);
    const staff = await AddStaff.findOne({ email });
    console.log('Staff search result:', staff);
    if (!staff) {
      console.log('Staff not found');
      return res.status(400).json({ message: 'Staff not found with this email' });
    }
    console.log('Staff found:', JSON.stringify(staff, null, 2));

    const isMatch = await staff.comparePassword(password);
    console.log('Password match:', isMatch);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect password' });
    }

    const token = generateToken(staff);
    console.log('Generated token:', token);
    res.status(200).json({ 
      message: 'Login successful', 
      token,
      role: staff.role,
      userType: 'staff',
      name: staff.name,
      email: staff.email
    });
  } catch (error) {
    console.error('Staff login error:', error);
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
    // Parse the request body if it's a string
    let body = req.body;
    if (typeof body === 'object' && Object.keys(body).length === 1) {
      const key = Object.keys(body)[0];
      try {
        body = JSON.parse(key);
      } catch (e) {
        console.error('Error parsing request body:', e);
      }
    }

    console.log('Received body:', body);

    const { name, email, password } = body;

    // Check if all required fields are provided
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required fields." });
    }

    // Check if a staff with this email already exists
    const existingStaff = await AddStaff.findOne({ email });
    if (existingStaff) {
      return res.status(400).json({ message: "A staff member with this email already exists." });
    }

    // Create a new Staff document
    const newStaff = new AddStaff({
      name,
      email,
      password,
      role: 'superadmin'
    });

    // Save the new staff member
    await newStaff.save();

    console.log('Super admin created:', newStaff);

    res.status(201).json({ message: 'Super admin created successfully' });
  } catch (error) {
    console.error('Error in superAdminSignup:', error);
    res.status(500).json({ message: 'Error creating super admin', error: error.message });
  }
};

exports.adminAddStaff = async (req, res) => {
  try {
    // Parse the request body if it's a string
    let body = req.body;
    if (typeof body === 'object' && Object.keys(body).length === 1) {
      const key = Object.keys(body)[0];
      try {
        body = JSON.parse(key);
      } catch (e) {
        console.error('Error parsing request body:', e);
      }
    }

    console.log('Received body:', body);

    // Trim whitespace from keys
    body = Object.fromEntries(
      Object.entries(body).map(([k, v]) => [k.trim(), v])
    );

    const { name, email, password, role } = body;

    // Check if all required fields are provided
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "Name, email, password, and role are required fields." });
    }

    // Validate role
    const validRoles = ['staff', 'admin', 'superadmin'];
    if (!validRoles.includes(role.toLowerCase())) {
      return res.status(400).json({ message: "Invalid role. Must be 'staff', 'admin', or 'superadmin'." });
    }

    // Check if a staff with this email already exists
    let staff = await AddStaff.findOne({ email });
    if (staff) {
      return res.status(400).json({ message: 'Staff member with this email already exists' });
    }

    // Create and save the new staff member
    staff = new AddStaff({ 
      name, 
      email, 
      password, 
      role: role.toLowerCase() 
    });
    await staff.save();

    res.status(201).json({ message: 'Staff member added successfully' });
  } catch (error) {
    console.error('Error in adminAddStaff:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
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
