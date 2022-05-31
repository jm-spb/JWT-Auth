const bcrypt = require('bcrypt');
const uuid = require('uuid').v4;
const sendActivationMail = require('./mail-service.js');
const UserDto = require('../dtos/user-dto.js');
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
    `${process.env.API_URL}/api/activate/${activationLink}`,
  );
  const userDto = new UserDto(newUser); // id, email, isActivated
  const tokens = createTokens({ ...userDto });
  await saveToken(userDto.id, tokens.refreshToken);

  return {
    ...tokens,
    user: userDto,
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

  const isPassEquals = await bcrypt.compare(password, foundUser.password);
  if (!isPassEquals) {
    throw ApiError.BadRequset('Wrong Password');
  }

  const userDto = new UserDto(foundUser);
  const tokens = createTokens({ ...userDto });
  await saveToken(userDto.id, tokens.refreshToken);

  return {
    ...tokens,
    user: userDto,
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

  const userData = await validateRefreshToken(refreshToken);
  const tokenFromDB = await findToken(refreshToken);

  if (!userData || !tokenFromDB) {
    console.log('!refreshToken');
    throw ApiError.UnauthorizedError();
  }

  const user = await userModel.findById(userData.id);
  const userDto = new UserDto(user);
  const tokens = createTokens({ ...userDto });
  await saveToken(userDto.id, tokens.refreshToken);

  return {
    ...tokens,
    user: userDto,
  };
};

module.exports = {
  registration,
  activate,
  login,
  logout,
  refresh,
};
