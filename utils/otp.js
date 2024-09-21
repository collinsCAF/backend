const crypto = require('crypto');
const nodemailer = require('nodemailer');
const config = require('../utils/config')


const generateOTP = () => {
    const otpLength = 4;
    let otp = '';
    for (let i = 0; i < otpLength; i++) {
        otp += crypto.randomInt(0, 10); // Generate a random number between 0 and 9
    }
    return otp;
};

const sendOTP = (email, OTP) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        secure: false,
        auth: {
            user: config.EMAIL_SERVICE_USER,
            pass: config.EMAIL_SERVICE_PASS,
        },
        tls: {
            rejectUnauthorized: false,
        },
    });

    const mailOptions = {
        from: config.EMAIL_SERVICE_USER,
        to: email,
        subject: 'Your OTP',
        text: `Your OTP is: ${OTP}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('error', error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};
const sendStaffMessage = (email, ) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        secure: false,
        auth: {
            user: config.EMAIL_SERVICE_USER,
            pass: config.EMAIL_SERVICE_PASS,
        },
        tls: {
            rejectUnauthorized: false,
        },
    });

    const mailOptions = {
        from: config.EMAIL_SERVICE_USER,
        to: email,
        subject: 'Your OTP',
        text: `Your OTP is: `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('error', error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};


module.exports = { generateOTP, sendOTP, sendStaffMessage };