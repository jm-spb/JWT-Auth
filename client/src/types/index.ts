export interface IUser {
  id: string;
  userEmail: string;
  isActivated: boolean;
}

export interface IAuthResponse {
  accessToken: string;
  refreshToken: string;
  user: IUser;
}

export interface IFormInputs {
  email: string;
  password: string;
}

export interface ILocation {
  path: string;
}
