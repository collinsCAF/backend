const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

const StaffSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ['staff', 'super_admin'],
        default: 'staff'
    },
    OTP: { type: String },
    OTPCreatedTime: { type: Date },
    OTPAttempts: { type: Number, default: 0 },
    isBlocked: { type: Boolean, default: false },
    blockUntil: { type: Date },
    refreshToken: { type: String },
    requireOTP: { type: Boolean, default: false }
});

StaffSchema.pre('save', async function (next) {
    const user = this;
    if (!user.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

StaffSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Staff', StaffSchema);
