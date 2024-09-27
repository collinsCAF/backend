const crypto = require('crypto');
const nodemailer = require('nodemailer');
const generateEmailTemplate = require('./emailTemplate');

const generateOTP = () => {
    const otpLength = 4;
    let otp = '';
    for (let i = 0; i < otpLength; i++) {
        otp += crypto.randomInt(0, 10); // Generate a random number between 0 and 9
    }
    return otp;
};

const sendOTP = async (email, otp) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'OTP Verification',
            html: generateEmailTemplate(otp)
        };

        await transporter.sendMail(mailOptions);
        console.log('OTP sent successfully');
    } catch (error) {
        console.error('Error sending OTP:', error);
        throw error; // Rethrow the error so it can be handled in the controller
    }
};

const sendStaffMessage = async (email, password, otp) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Staff Account Created',
            html: `
                <h1>Welcome to Our Team!</h1>
                <p>Your account has been created with the following credentials:</p>
                <p>Email: ${email}</p>
                <p>Temporary Password: ${password}</p>
                <p>Your OTP for first-time login: ${otp}</p>
                <p>Please change your password after your first login.</p>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log('Staff message sent successfully');
    } catch (error) {
        console.error('Error sending staff message:', error);
        throw error; // Rethrow the error so it can be handled in the controller
    }
};

module.exports = { generateOTP, sendOTP, sendStaffMessage };