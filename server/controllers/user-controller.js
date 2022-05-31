const { validationResult } = require('express-validator');
require('dotenv').config();
const userService = require('../service/user-service.js');
const ApiError = require('../errors/api-error.js');

const userRegistration = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(ApiError.BadRequset('Validation error', errors.array()));
    }

    const { email, password } = req.body;
    const userData = await userService.registration(email, password);
    res.cookie('refreshToken', userData.refreshToken, {
      maxAge: 2592000000,
      httpOnly: true,
    });

    return res.json(userData);
  } catch (e) {
    next(e);
  }
};

const userActivate = async (req, res, next) => {
  try {
    const activationLink = req.params.link;
    await userService.activate(activationLink);
    return res.redirect(process.env.CLIENT_URL);
  } catch (e) {
    next(e);
  }
};

const userRefresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    console.log(refreshToken);
    const userData = await userService.refresh(refreshToken);
    res.cookie('refreshToken', userData.refreshToken, {
      maxAge: 2592000000,
      httpOnly: true,
    });
    return res.json(userData);
  } catch (e) {
    next(e);
  }
};

const userLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const userData = await userService.login(email, password);
    res.cookie('refreshToken', userData.refreshToken, {
      maxAge: 2592000000,
      httpOnly: true,
    });
    return res.json(userData);
  } catch (e) {
    next(e);
  }
};

const userLogout = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    await userService.logout(refreshToken);
    res.clearCookie('refreshToken');
    return res.sendStatus(200);
  } catch (e) {
    next(e);
  }
};

module.exports = {
  userRegistration,
  userActivate,
  userRefresh,
  userLogin,
  userLogout,
};
