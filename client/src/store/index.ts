import axios from 'axios';
import { makeAutoObservable } from 'mobx';
import AuthService from '../services/AuthService';
import { IAuthResponse, IUser } from '../types';

export default class Store {
  user = {} as IUser;
  isAuth = false;
  isLoading = true;
  apiError = '';

  constructor() {
    makeAutoObservable(this);
  }

  private _setAuth(bool: boolean) {
    this.isAuth = bool;
  }
  private _setUser(user: IUser) {
    this.user = user;
  }

  private _setApiError(msg: string) {
    this.apiError = msg;
  }

  setIsLoading(bool: boolean) {
    this.isLoading = bool;
  }

  async login(email: string, password: string) {
    try {
      const response = await AuthService.login(email, password);
      console.log(response);
      localStorage.setItem('token', response.data.accessToken);
      this._setAuth(true);
      this._setUser(response.data.user);
    } catch (err) {
      const error = err as any;
      this._setApiError(error.response?.data?.message);
      console.log(error.response?.data?.message);
    }
  }

  async registration(email: string, password: string) {
    try {
      const response = await AuthService.registration(email, password);
      console.log(response);
      localStorage.setItem('token', response.data.accessToken);
      this._setAuth(true);
      this._setUser(response.data.user);
    } catch (err) {
      const error = err as any;
      this._setApiError(error.response?.data?.message);
      console.log(error.response?.data?.message);
    }
  }

  async logout() {
    try {
      await AuthService.logout();
      localStorage.removeItem('token');
      this._setAuth(false);
      this._setUser({} as IUser);
    } catch (err) {
      const error = err as any;
      this._setApiError(error.response?.data?.message);
      console.log(error.response.data.message);
    }
  }

  async checkAuth() {
    this.setIsLoading(true);
    try {
      const response = await axios.get<IAuthResponse>(
        `${process.env.REACT_APP_API_URL}/api/refresh`,
        { withCredentials: true },
      );
      localStorage.setItem('token', response.data.accessToken);
      this._setAuth(true);
      this._setUser(response.data.user);
    } catch (err) {
      const error = err as any;
      this._setApiError(error.response?.data?.message);
      console.log(error.response.data.message);
    } finally {
      this.setIsLoading(false);
    }
  }
}
