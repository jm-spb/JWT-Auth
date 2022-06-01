import { observer } from 'mobx-react-lite';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Context } from '..';

const LoginForm = (): JSX.Element => {
  const { store } = React.useContext(Context);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const onSubmit = (data: any) => {
    const { email, password } = data;
    store.login(email, password);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor="email">
        Email Address
        <input
          {...register('email', {
            required: 'Email field is empty',
          })}
          id="email"
          type="email"
          placeholder="Enter email"
        />
      </label>
      <div>{errors?.email && <span>{errors?.email.message}</span>}</div>

      <label htmlFor="password">
        Password
        <input
          {...register('password', {
            required: 'Password field is empty',
          })}
          id="password"
          type="password"
          placeholder="Enter password"
        />
      </label>
      <div>{errors?.password && <span>{errors?.password.message}</span>}</div>

      <button type="submit">Login</button>
    </form>
  );
};

export default observer(LoginForm);
