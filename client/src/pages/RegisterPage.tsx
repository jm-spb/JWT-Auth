import React from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { Context } from '..';
import Form from '../components/Form';
import { IFormInputs } from '../types';

const RegisterPage = (): JSX.Element => {
  const { store } = React.useContext(Context);
  const navigate = useNavigate();

  const onSubmit = async ({ email, password }: IFormInputs) => {
    await store.registration(email, password);
    // TODO: if registrationIsSuccess -> navigate
    navigate('/account/login');
  };

  const apiErrorMsg = store.apiError ? (
    <div className="container__api-error">{store.apiError}</div>
  ) : null;

  return (
    <Form formName="Sign Up" apiErrorMsg={apiErrorMsg} onSubmit={onSubmit} registerPage />
  );
};

export default observer(RegisterPage);
