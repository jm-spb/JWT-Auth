import api from '../api';
import { AxiosResponse } from 'axios';
import { IUser } from '../types';

export default class UserService {
  static async fetchAllUsers(): Promise<AxiosResponse<IUser[]>> {
    return api.get<IUser[]>('/users');
  }
}
