const { generateOTP, sendOTP } = require('../utils/otp')
const express = require("express")
const User = require("../models/User")
const jwt = require('jsonwebtoken');
const StaffQuestionTracker = require('../models/StaffQuestionTracker');
const { getQuestionCountByStaff } = require('./Question');





exports.signup = async (req, res) => {
  const { name, email, password, phoneNumber, school } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User Details have already been used' });

    const OTP = generateOTP();
    // sendOTP(email, OTP);
    const OTPCreatedTime = new Date();

    user = new User({ name, email, password, phoneNumber, school, OTP, OTPCreatedTime });
    await user.save();



    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

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


exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    // Assuming the user is successfully authenticated
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Fetch the question tracker for this user
    const questionTracker = await StaffQuestionTracker.findOne({ staffId: user._id })
      .populate('questionsAnswered.questionId', 'questionText category');

    // Count the number of questions answered
    const questionsAnsweredCount = questionTracker ? questionTracker.questionsAnswered.length : 0;

    // Get the count of questions uploaded by this staff member
    const questionsUploadedCount = await getQuestionCountByStaff(user._id);

    // Return the user info along with the question tracking data
    return res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        questionsAnswered: questionsAnsweredCount,
        questionsUploaded: questionsUploadedCount,
        recentQuestions: questionTracker ? questionTracker.questionsAnswered.slice(-5) : []
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Login failed',
      error: error.message
    });
  }
};


exports.forgetPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
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

  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: 'Invalid email' });
    if (user.OTP !== otp) return res.status(400).json({ message: 'Invalid OTP' });

    const currentTime = new Date();
    const otpAge = (currentTime - user.OTPCreatedTime) / 1000; // age in seconds
    if (otpAge > 300) return res.status(400).json({ message: 'OTP expired' }); // OTP expires in 5 minutes (300 seconds)

    if (newPassword !== confirmPassword) return res.status(400).json({ message: 'Passwords do not match' });

    user.password = newPassword; // Hash the password before saving
    user.OTP = null;
    user.OTPCreatedTime = null;
    await user.save();

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
};
