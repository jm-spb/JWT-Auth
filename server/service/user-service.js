import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import mailService from './mail-service.js';
import UserDto from '../dtos/user-dto.js';
import tokenService from './token-service.js';
import userModel from '../models/user-model.js';
import ApiError from '../errors/api-error.js';

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

    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDB = tokenService.findToken(refreshToken);

    if (!userData || !tokenFromDB) {
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

export default new UserService();
