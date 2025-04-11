const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "User", enum: ["User", "Admin"] },
    verificationCode: String,
    verificationCodeExpires: Date,
    isEntryComplete: { type: Boolean, default: false }, 
    uniqueCode: { type: String, unique: true },
    hasActiveSubscription: { type: Boolean, default: false },
    subscriptionExpireDate: { type: Date, default: null }, 
    profileImage: { type: String, default: "" },
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
