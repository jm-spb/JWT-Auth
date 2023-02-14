import React from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff } from 'react-feather';
import '../styles/LoginForm.scss';
import { IFormInputs, IFormProps } from '../types';
import { ButtonSpinner } from './Spinners';

const Form = ({
  formName,
  apiErrorMsg,
  onSubmit,
  bottomNavigation,
  registerPage,
  isLoading,
  passwordValidation,
}: IFormProps): JSX.Element => {
  const {
    register,
    watch,
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

  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);

  const password = React.useRef({});
  password.current = watch('password', '');

  const toggleShowPassword = () => {
    setIsPasswordVisible((prev) => !prev);
  };

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
          {/* {errors?.email ? (
            <span className="form__error">{errors?.email.message}</span>
          ) : (
            <span className="form__empty" />
          )} */}
          {errors?.email && <span className="form__error">{errors?.email.message}</span>}
        </label>

        <label className="form__label" htmlFor="password">
          Password
          <input
            {...register('password', passwordValidation)}
            className="form__input"
            id="password"
            type={isPasswordVisible ? 'text' : 'password'}
            placeholder="Enter password"
          />
          <span className="form__togglePassword" onClick={toggleShowPassword}>
            {isPasswordVisible ? <EyeOff /> : <Eye />}
          </span>
          {errors?.password && (
            <span className="form__error">{errors?.password.message}</span>
          )}
        </label>

        {registerPage ? (
          <>
            <label className="form__label" htmlFor="passwordConfirm">
              Confirm password
              <input
                {...register('passwordConfirm', {
                  required: 'Password field is empty',
                  validate: (value) =>
                    value === password.current || 'The passwords do not match',
                })}
                className="form__input"
                id="passwordConfirm"
                type={isPasswordVisible ? 'text' : 'password'}
                placeholder="Enter password"
              />
              {errors?.passwordConfirm && (
                <span className="form__error">{errors?.passwordConfirm.message}</span>
              )}
            </label>
          </>
        ) : null}
        <button
          className="btn form__submit"
          type="submit"
          disabled={!isValid || isLoading}
        >
          <span className="btn__content">
            <span>{formName}</span>
            {isLoading ? <ButtonSpinner /> : null}
          </span>
        </button>
      </form>
      {bottomNavigation}
    </article>
  );
};

export default Form;
