import React from 'react';
import { observer } from 'mobx-react-lite';
import { Link, useNavigate } from 'react-router-dom';
import { Context } from '..';
import Form from '../components/Form';
import { IFormInputs, RegisterOptions } from '../types';

// Validate password only on Register Page
const passwordValidation: RegisterOptions = {
  required: 'Password field is empty',
  /* Password should contain at least: 
    - 1 digit
    - 1 small-case letter
    - 1 capital letter
    - 1 special character
    - length: 6-10 characters
    - order not important
    1A2a$5              
    */

  minLength: {
    value: 6,
    message: 'Password length should be more than 5 characters',
  },
  maxLength: {
    value: 10,
    message: 'Password length should be less than 11 characters',
  },
  pattern: {
    value:
      /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*\s).*$/gm,
    message:
      'Password must have at least: one number, letter, capital letter, special character',
  },
};

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

  // Clear RegistrationErrorMessage when leave RegistrationPage
  React.useEffect(() => {
    return () => {
      store.setRegistrationError('');
    };
  }, []);

  const onSubmit = async ({ email, password }: IFormInputs) => {
    await store.registration(email, password);
    // if no errors on registration -> redirect to LoginPage
    if (!store.registrationError) {
      navigate('/account/login');
    }
  };

  const apiErrorMsg = store.registrationError ? (
    <div className="container__api-error">{store.registrationError}</div>
  ) : (
    ''
  );

  return (
    <Form
      formName="Sign Up"
      apiErrorMsg={apiErrorMsg}
      onSubmit={onSubmit}
      registerPage
      bottomNavigation={bottomNavigation}
      isLoading={store.isLoading}
      passwordValidation={passwordValidation}
    />
  );
};

export default observer(RegisterPage);
