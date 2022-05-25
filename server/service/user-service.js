import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import mailService from './mail-service.js';
import UserDto from '../dtos/user-dto.js';
import tokenService from './token-service.js';
import userModel from '../models/user-model.js';

class UserService {
  async registration(email, password) {
    const foundUser = await userModel.findOne({ email });
    if (foundUser) {
      throw new Error(`User with email: ${email} is already exist`);
    }
    const hashPassword = bcrypt.hashSync(password, 5);
    const activationLink = uuid();
    const newUser = await userModel.create({
      email,
      password: hashPassword,
      activationLink,
    });   
     
    await mailService.sendActivationMail(email, activationLink);   
    const userDto = new UserDto(newUser); // id, email, isActivated
    const tokens = tokenService.createTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      user: userDto,
    };
  }
}

export default new UserService();
