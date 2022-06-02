import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Context } from '..';

const RequireAuth = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const { store } = React.useContext(Context);
  const location = useLocation();

  if (!store.isAuth) {
    return <Navigate to="/account/login" replace state={{ path: location.pathname }} />;
  }

  return <>{children}</>;
};

export default RequireAuth;
