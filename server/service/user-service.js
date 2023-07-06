const bcrypt = require('bcrypt');
const uuid = require('uuid').v4;
const sendActivationMail = require('./mail-service.js');
const {
  createTokens,
  findToken,
  removeToken,
  saveToken,
  validateRefreshToken,
} = require('./token-service.js');
const userModel = require('../models/user-model.js');
const ApiError = require('../errors/api-error.js');

const registration = async (email, password) => {
  const foundUser = await userModel.findOne({ email });
  if (foundUser) {
    throw ApiError.BadRequset(`User with email: ${email} is already exist`);
  }

  const hashPassword = bcrypt.hashSync(password, 5);
  const activationLink = uuid();
  const newUser = await userModel.create({
    email,
    password: hashPassword,
    activationLink,
  });

  await sendActivationMail(
    email,
    `${process.env.API_URL}/api/activate/${activationLink}`
  );
  const { _id: id, email: userEmail, isActivated } = newUser;
  const tokens = createTokens({ id, userEmail, isActivated });
  await saveToken(id, tokens.refreshToken);

  return {
    ...tokens,
    user: { id, userEmail, isActivated },
  };
};

const activate = async (activationLink) => {
  const user = await userModel.findOne({ activationLink });
  if (!user) {
    throw ApiError.BadRequset('Unvalid activation link');
  }

  user.isActivated = true;
  await user.save();
};

const login = async (email, password) => {
  const foundUser = await userModel.findOne({ email });
  if (!foundUser) {
    throw ApiError.BadRequset(`User with email: ${email} is not found`);
  }

  const isMatch = await bcrypt.compare(password, foundUser.password);
  if (!isMatch) {
    throw ApiError.BadRequset('Wrong Password');
  }

  const { _id: id, email: userEmail, isActivated } = foundUser;
  const tokens = createTokens({ id, userEmail, isActivated });
  await saveToken(id, tokens.refreshToken);

  return {
    ...tokens,
    user: { id, userEmail, isActivated },
  };
};

const logout = async (refreshToken) => {
  await removeToken(refreshToken);
  return;
};

const refresh = async (refreshToken) => {
  if (!refreshToken) {
    throw ApiError.UnauthorizedError();
  }

  const userData = validateRefreshToken(refreshToken);
  const tokenFromDB = await findToken(refreshToken);

  if (!userData || !tokenFromDB) {
    throw ApiError.UnauthorizedError();
  }

  const foundUser = await userModel.findById(userData.id);
  const { _id: id, email: userEmail, isActivated } = foundUser;
  const tokens = createTokens({ id, userEmail, isActivated });
  await saveToken(id, tokens.refreshToken);

  return {
    ...tokens,
    user: { id, userEmail, isActivated },
  };
};

const fetchAllUsers = async () => {
  const response = await userModel.aggregate([
    { $group: { _id: '$_id', userEmail: { $first: '$email' } } },
  ]);
  return response;
};

module.exports = {
  registration,
  activate,
  login,
  logout,
  refresh,
  fetchAllUsers,
};
