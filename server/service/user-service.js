const bcrypt = require('bcrypt');
const uuid = require('uuid').v4;
const mailService = require('./mail-service.js');
const UserDto = require('../dtos/user-dto.js');
const tokenService = require('./token-service.js');
const userModel = require('../models/user-model.js');
const ApiError = require('../errors/api-error.js');

class UserService {
  async registration(email, password) {
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

    await mailService.sendActivationMail(
      email,
      `${process.env.API_URL}/api/activate/${activationLink}`,
    );
    const userDto = new UserDto(newUser); // id, email, isActivated
    const tokens = tokenService.createTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      user: userDto,
    };
  }

  async activate(activationLink) {
    const user = await userModel.findOne({ activationLink });
    if (!user) {
      throw ApiError.BadRequset('Unvalid activation link');
    }

    user.isActivated = true;
    await user.save();
  }

  async login(email, password) {
    const foundUser = await userModel.findOne({ email });
    if (!foundUser) {
      throw ApiError.BadRequset(`User with email: ${email} is not found`);
    }

    const isPassEquals = await bcrypt.compare(password, foundUser.password);
    if (!isPassEquals) {
      throw ApiError.BadRequset('Wrong Password');
    }

    const userDto = new UserDto(foundUser);
    const tokens = tokenService.createTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      user: userDto,
    };
  }

  async logout(refreshToken) {
    await tokenService.removeToken(refreshToken);
    return;
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }

    const userData = await tokenService.validateRefreshToken(refreshToken);
    const tokenFromDB = await tokenService.findToken(refreshToken);
    // console.log(userData)
    console.log(tokenFromDB);

    if (!userData || !tokenFromDB) {
      console.log('!refreshToken');
      throw ApiError.UnauthorizedError();
    }

    const user = await userModel.findById(userData.id);
    const userDto = new UserDto(user);
    const tokens = tokenService.createTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      user: userDto,
    };
  }
}

module.exports = new UserService();
