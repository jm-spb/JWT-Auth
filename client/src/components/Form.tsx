import React from 'react';
import { useForm } from 'react-hook-form';
import '../styles/LoginForm.scss';
import { IFormInputs, IFormProps } from '../types';

const Form = ({
  formName,
  apiErrorMsg,
  onSubmit,
  signUpSuggestion,
}: IFormProps): JSX.Element => {
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
              /* Password should contain at least: 
              - 1 digit
              - 1 small-case letter
              - 1 capital letter
              - 1 special character
              - length: 6-10 characters
              - order not important              
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
                  'Password must have at least: one number, one letter, one capital letter, one special character',
              },
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

export default Form;
