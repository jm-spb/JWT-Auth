import React from 'react';
import { useForm } from 'react-hook-form';
import '../styles/LoginForm.scss';
import { IFormInputs } from '../types';

interface ILoginForm {
  formName: string;
  apiErrorMsg: JSX.Element | null;
  onSubmit: ({ email, password }: IFormInputs) => Promise<void>;
  signUpSuggestion?: JSX.Element;
}

const LoginForm = ({
  formName,
  apiErrorMsg,
  onSubmit,
  signUpSuggestion,
}: ILoginForm): JSX.Element => {
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

  return (
    <article className="container">
      <h1 className="container__heading">{formName}</h1>
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
        {errors?.email ? (
          <span className="form__error">{errors?.email.message}</span>
        ) : (
          <span className="form__empty" />
        )}

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
        {errors?.password ? (
          <span className="form__error">{errors?.password.message}</span>
        ) : (
          <span className="form__empty" />
        )}

        <button className="btn form__submit" type="submit" disabled={!isValid}>
          {formName}
        </button>
      </form>
      {signUpSuggestion}
    </article>
  );
};

export default LoginForm;
