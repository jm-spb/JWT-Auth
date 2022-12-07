import React from 'react';
import { observer } from 'mobx-react-lite';
import { Link, useNavigate } from 'react-router-dom';
import { Context } from '..';
import Form from '../components/Form';
import { IFormInputs } from '../types';

const bottomNavigation = (
  <span className="container__signup signup">
    Already signed up?{' '}
    <Link className="signup__link" to={'/account/login'}>
      Log in!
    </Link>
  </span>
);

const RegisterPage = (): JSX.Element => {
  const { store } = React.useContext(Context);
  const navigate = useNavigate();

  const onSubmit = async ({ email, password }: IFormInputs) => {
    await store.registration(email, password);
    // if no errors on registration -> redirect to LoginPage
    if (!store.registrationError) {
      navigate('/account/login');
    }
  };

  const apiErrorMsg = store.registrationError ? (
    <div className="container__api-error">{store.registrationError}</div>
  ) : null;

  return (
    <Form
      formName="Sign Up"
      apiErrorMsg={apiErrorMsg}
      onSubmit={onSubmit}
      registerPage
      bottomNavigation={bottomNavigation}
      isLoading={store.isLoading}
    />
  );
};

export default observer(RegisterPage);
