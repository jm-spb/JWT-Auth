const jwt = require('jsonwebtoken');
const tokenModel = require('../models/token-model.js');

const createTokens = (payload) => {
  const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_KEY, {
    expiresIn: '30m',
  });
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_KEY, {
    expiresIn: '30d',
  });
  return {
    accessToken,
    refreshToken,
  };
};

const saveToken = async (userId, refreshToken) => {
  const tokenData = await tokenModel.findOne({ user: userId });
  if (tokenData) {
    tokenData.refreshToken = refreshToken;
    return tokenData.save();
  }
  const token = await tokenModel.create({ user: userId, refreshToken });
  return token;
};

const removeToken = async (refreshToken) => {
  await tokenModel.deleteOne({ refreshToken });
  return;
};

const validateAccessToken = async (token) => {
  try {
    const userData = jwt.verify(token, process.env.JWT_ACCESS_KEY);
    return userData;
  } catch (e) {
    return null;
  }
};

const validateRefreshToken = async (token) => {
  try {
    const userData = jwt.verify(token, process.env.JWT_REFRESH_KEY);
    return userData;
  } catch (e) {
    return null;
  }
};

const findToken = async (refreshToken) => {
  const tokenData = await tokenModel.findOne({ refreshToken });
  return tokenData;
};

module.exports = {
  createTokens,
  saveToken,
  removeToken,
  validateAccessToken,
  validateRefreshToken,
  findToken,
};
