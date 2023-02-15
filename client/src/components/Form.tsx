import React from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff } from 'react-feather';
import '../styles/Form.scss';
import { IFormInputs, IFormProps } from '../types';
import { ButtonSpinner } from './Spinners';

const examplePassword = process.env.REACT_APP_EXAMPLE_PASSWORD as string;

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
    setValue,
    getValues,
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

  const handlePasswordCopy = () => {
    const value = getValues('password');
    if (value === examplePassword) return;

    setValue('password', examplePassword, { shouldValidate: true });
    setValue('passwordConfirm', examplePassword, { shouldValidate: false });
  };

  return (
    <>
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
            {errors?.email && (
              <span className="form__error">{errors?.email.message}</span>
            )}
          </label>

          <label className="form__label" htmlFor="password">
            Password
            <div className="form__group">
              <input
                {...register('password', {
                  required: 'Password field is empty',
                  ...passwordValidation,
                })}
                className="form__input"
                id="password"
                type={isPasswordVisible ? 'text' : 'password'}
                placeholder="Enter password"
              />
              <span className="form__togglePassword" onClick={toggleShowPassword}>
                {isPasswordVisible ? <EyeOff /> : <Eye />}
              </span>
            </div>
            {errors?.password && (
              <span className="form__error">{errors?.password.message}</span>
            )}
          </label>

          {registerPage && (
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
          )}
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

      <article className="notes">
        <h2 className="notes__heading">Please note the following:</h2>
        <ol className="notes__ordered-list">
          <li>
            For testing purposes, the TTL of the tokens is set as follows:
            <ul className="notes__unordered-list">
              <li>10sec - for Access Token</li>
              <li>30sec - for Refresh Token</li>
            </ul>
          </li>
          <li>
            Password should contain at least:
            <ul className="notes__unordered-list">
              <li>1 number</li>
              <li>1 lower case letter</li>
              <li>1 capital letter</li>
              <li>
                1 special character <i>(ex. !@#$%^*()_+{};?/.,)</i>
              </li>
              <li>Length: 6-10 characters</li>
              <li>Order not important</li>
            </ul>
          </li>
          <li>
            To meet all password requirements, you can use this example:{' '}
            <button className="notes__btn" onClick={handlePasswordCopy}>
              Click to paste
            </button>
          </li>
        </ol>
      </article>
    </>
  );
};

export default Form;
