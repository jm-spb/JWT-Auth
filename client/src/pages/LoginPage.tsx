import React from 'react';
import { observer } from 'mobx-react-lite';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Context } from '..';
import Form from '../components/Form';
import { IFormInputs, ILocation } from '../types';

const bottomNavigation = (
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

  // Clear LoginErrorMessage when leave LoginPage
  React.useEffect(() => {
    return () => {
      store.setLoginError('');
    };
  }, []);

  const onSubmit = async ({ email, password }: IFormInputs) => {
    await store.login(email, password);
    if (!store.loginError) {
      navigate(state?.path || '/');
    }
  };

  const apiErrorMsg = store.loginError ? (
    <div className="container__api-error">{store.loginError}</div>
  ) : (
    ''
  );

  return (
    <Form
      formName="Login"
      apiErrorMsg={apiErrorMsg}
      onSubmit={onSubmit}
      bottomNavigation={bottomNavigation}
      isLoading={store.isLoading}
    />
  );
};

export default observer(LoginPage);
