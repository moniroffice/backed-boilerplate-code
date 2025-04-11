import jwt from 'jsonwebtoken';
import config from '../core/config/config.js';  

export const generateToken = (payload) => {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtExpire });
};



const jwt = require("jsonwebtoken");
const { refreshTokenSecrete,accessTokenSecrete, accessTokenExpires, refreshTokenExpires } = require("../config");

const generateAccessToken = (id,email,role) => {
  return jwt.sign({ id,email,role },accessTokenSecrete , { expiresIn: accessTokenExpires });
};

const generateRefreshToken = (id,email,role) => {
  return jwt.sign({ id,email,role }, refreshTokenSecrete, { expiresIn: refreshTokenExpires });
};

module.exports = { generateAccessToken, generateRefreshToken };
