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
  state: {path: string};
}

export interface IFormProps {
  formName: string;
  apiErrorMsg: JSX.Element | null;
  onSubmit: ({ email, password }: IFormInputs) => Promise<void>;
  signUpSuggestion?: JSX.Element;
  registerPage? : boolean;
}
