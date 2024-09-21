// models/User.js
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    confirmpassword: { type: String, required: true },
    OTP: { type: String },
    OTPCreatedTime: { type: Date },
    OTPAttempts: { type: Number, default: 0 },
    isBlocked: { type: Boolean, default: false },
    blockUntil: { type: Date },
});

userSchema.pre('save', async function (next) {
    const user = this;
    if (!user.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        user.confirmpassword = await bcrypt.hash(user.confirmpassword, salt);
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('eduUsers', userSchema);

module.exports = User;
