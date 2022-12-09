import { RegisterOptions } from 'react-hook-form';
export type { RegisterOptions };

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
  passwordConfirm: string;
}

export interface ILocation {
  state: { path: string };
}

export interface IFormProps {
  formName: string;
  apiErrorMsg: JSX.Element | string;
  onSubmit: ({ email, password }: IFormInputs) => Promise<void>;
  bottomNavigation: JSX.Element;
  registerPage?: boolean;
  passwordValidation?: RegisterOptions;
  isLoading: boolean;
}
