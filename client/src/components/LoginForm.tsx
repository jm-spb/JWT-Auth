import { observer } from 'mobx-react-lite';
import React from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import '../styles/LoginForm.scss';
import { Context } from '..';
import { IFormInputs } from '../types';

const LoginForm = (): JSX.Element => {
  const { store } = React.useContext(Context);

  const {
    register,
    formState: { errors, isValid, isSubmitSuccessful },
    handleSubmit,
    reset,
  } = useForm<IFormInputs>({
    mode: 'onBlur',
  });

  React.useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  const onSubmit = ({ email, password }: IFormInputs) => store.login(email, password);
  const apiErrorMsg = store.apiError ? (
    <div className="container__api-error">{store.apiError}</div>
  ) : null;

  return (
    <article className="container">
      <h1 className="container__heading">Login</h1>
      {apiErrorMsg}
      <form className="form" onSubmit={handleSubmit(onSubmit)}>
        <label className="form__label" htmlFor="email">
          Email Address
          <input
            {...register('email', {
              required: 'Email field is empty',
            })}
            className="form__input"
            id="email"
            type="email"
            placeholder="Enter email"
          />
        </label>
        {errors?.email && <span className="form__error">{errors?.email.message}</span>}

        <label className="form__label" htmlFor="password">
          Password
          <input
            {...register('password', {
              required: 'Password field is empty',
            })}
            className="form__input"
            id="password"
            type="password"
            placeholder="Enter password"
          />
        </label>
        {errors?.password && (
          <span className="form__error">{errors?.password.message}</span>
        )}

        <button className="btn form__submit" type="submit" disabled={!isValid}>
          Login
        </button>
      </form>
      <span className="container__signup signup">
        Don't have an account?{' '}
        <Link className="signup__link" to={'/account/register'}>
          Sign Up!
        </Link>{' '}
      </span>
    </article>
  );
};

export default observer(LoginForm);
