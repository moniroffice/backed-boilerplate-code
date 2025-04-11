const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

const { refreshTokenSecrete, salt, emailExpires } = require("../config");
const { verificationCodeTemplate } = require("../utils/emailTemplates");



const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/generateToken");


let passwordResettable=false;


exports.registerUser = async (req, res) => {
  try {
    const { fullName, phoneNumber, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.json({
        status: false,
        message: "User already registered. Please login.",
        data: null,
      });
    }

    const uniqueCode = Array.from({ length: 6 }, () =>
      String.fromCharCode(Math.floor(Math.random() * 26) + 65)
    ).join("");

    const saltGenerated = await bcrypt.genSalt(parseInt(salt));
    const hashedPassword = await bcrypt.hash(password, saltGenerated);
    const newUser = new User({
      fullName,
      phoneNumber,
      email,
      password: hashedPassword,
      uniqueCode,
    });

    const user = await newUser.save();

    if (!user) {
      return res.json({
        status: false,
        message: "Registration failed",
        data: null,
      });
    }

    res.json({
      status: true,
      message: "Registered as inactive user!",
      data: null,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.json({
      status: false,
      message: "Registration failed",
      data: error.message,
    });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user)
      return res.json({ status: false, message: "User not found", data: null });

    if (!user.isEntryComplete) {
      return res.json({
        status: false,
        message: "Please complete your entry payment before logging in.",
        data: null,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.json({
        status: false,
        message: "Invalid credentials",
        data: null,
      });

    const accessToken = generateAccessToken(user.id, user.email, user.role);
    const refreshToken = generateRefreshToken(user.id, user.email, user.role);

    res.json({
      status: true,
      message: "Login successful",
      data: { accessToken, refreshToken },
    });
  } catch (error) {
    res.json({ status: false, message: "Login failed", data: error.message });
  }
};

exports.logoutUser = (req, res) => {
  res.json({
    status: true,
    message: "Logged out successfully",
    data: null,
  });
};

exports.refreshToken = (req, res) => {
  const { refreshTokenBody } = req.body;
  if (!refreshTokenBody)
    return res.json({ status: false, message: "No refresh token", data: null });

  try {
    const decoded = jwt.verify(refreshTokenBody, refreshTokenSecrete);
    const accessToken = generateAccessToken(decoded.id, decoded.email);
    const refreshToken = generateRefreshToken(decoded.id, decoded.email);

    res.json({
      status: true,
      message: "Refresh token is valid",
      data: { accessToken, refreshToken },
    });
  } catch (error) {
    console.log(error);
    res.json({ status: false, message: "Invalid refresh token", data: null });
  }
};


exports.forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.json({ status: false, message: "Invalid email", data: null });

    const verificationCode = Math.floor(100000 + Math.random() * 900000);
    const expiresIn = new Date();
    expiresIn.setMinutes(expiresIn.getMinutes() + emailExpires / 60000);

    user.verificationCode = verificationCode;
    user.verificationCodeExpires = expiresIn;
    await user.save();

    await sendEmail({
      to: user.email,
      subject: "Verification Code",
      html: verificationCodeTemplate(user.verificationCode),
    });
    res.json({
      status: true,
      message: "Verification code sent to your email",
      data: null,
    });
  } catch (error) {
    console.log(error);
    res.json({ status: false, message: "Forget password failed", data: null });
  }
};

exports.verifyCode = async (req, res) => {
  try {
    const { email, verificationCode } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.json({ status: false, message: "Invalid email", data: null });

    if (!user.verificationCode || !user.verificationCodeExpires) {
      return res.json({
        status: false,
        message: "No verification code found",
        data: null,
      });
    }

    if (new Date() > user.verificationCodeExpires) {
      return res.json({
        status: false,
        message: "Verification code expired",
        data: null,
      });
    }

    if (user.verificationCode !== verificationCode) {
      return res.json({
        status: false,
        message: "Invalid verification code",
        data: null,
      });
    }

    user.verificationCode = null;
    user.verificationCodeExpires = null;
    await user.save();

    passwordResettable = true;

    res.json({
      status: true,
      message: "Verification code verified successfully",
      data: null,
    });
  } catch (error) {
    res.json({ status: false, message: "Verification failed", data: null });
  }
};

exports.resetPassword = async (req, res) => {
  try {

    if (!passwordResettable) {
      return res.json({
        status: false,
        message: "Verification code not verified",
        data: null,
      });
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.json({ status: false, message: "Invalid email", data: null });



    if (user.verificationCode || user.verificationCodeExpires) {
      return res.json({
        status: false,
        message: "Verification code not verified",
        data: null,
      });
    }

    const saltGenerated = await bcrypt.genSalt(parseInt(salt));
    const hashedPassword = await bcrypt.hash(password, saltGenerated);

    user.password = hashedPassword;
    await user.save();

    passwordResettable = false;

    res.json({
      status: true,
      message: "Password reset successfully",
      data: null,
    });
  } catch (error) {
    console.log(error);
    res.json({ status: false, message: "Password reset failed", data: null });
  }
};


