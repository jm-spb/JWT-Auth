import React from 'react';
import { observer } from 'mobx-react-lite';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Context } from '..';
import Form from '../components/Form';
import { IFormInputs, ILocation } from '../types';

const signUpSuggestion = (
  <span className="container__signup signup">
    Don't have an account?{' '}
    <Link className="signup__link" to={'/account/register'}>
      Sign Up!
    </Link>
  </span>
);

const LoginPage = (): JSX.Element => {
  const { store } = React.useContext(Context);
  const navigate = useNavigate();
  const { state } = useLocation() as ILocation;

  const onSubmit = async ({ email, password }: IFormInputs) => {
    await store.login(email, password);
    navigate(state?.path || '/');
  };

  const apiErrorMsg = store.apiError ? (
    <div className="container__api-error">{store.apiError}</div>
  ) : null;

  return (
    <Form
      formName="Login"
      apiErrorMsg={apiErrorMsg}
      onSubmit={onSubmit}
      signUpSuggestion={signUpSuggestion}
    />
  );
};

export default observer(LoginPage);
