const { validationResult } = require('express-validator');
const userService = require('../service/user-service.js');
const ApiError = require('../errors/api-error.js');

const registration = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(ApiError.BadRequset('Validation error', errors.array()));
    }

    const { email, password } = req.body;
    const userData = await userService.registration(email, password);
    res.cookie('refreshToken', userData.refreshToken, {
      maxAge: 2592000000, // 30 days
      httpOnly: true,
    });

    return res.json(userData);
  } catch (e) {
    next(e);
  }
};

const activate = async (req, res, next) => {
  try {
    const activationLink = req.params.link;
    await userService.activate(activationLink);
    return res.redirect(process.env.CLIENT_URL);
  } catch (e) {
    next(e);
  }
};

const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
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

const login = async (req, res, next) => {
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

const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    await userService.logout(refreshToken);
    res.clearCookie('refreshToken');
    return res.sendStatus(200);
  } catch (e) {
    next(e);
  }
};

const fetchUsers = async (req, res, next) => {
  try {
    const fetchedUsers = await userService.fetchAllUsers();
    return res.json(fetchedUsers);
  } catch (e) {
    next(e);
  }
};

module.exports = {
  registration,
  activate,
  refresh,
  login,
  logout,
  fetchUsers,
};
