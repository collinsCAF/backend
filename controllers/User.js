const { generateOTP, sendOTP } = require('../utils/otp')
const express = require("express")
const User = require("../models/User")
const jwt = require('jsonwebtoken');


exports.allUsers = async (req, res) => {
    const users = await User.find({})
    res.json(users)
  }