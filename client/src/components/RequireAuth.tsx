import React from 'react';
import { observer } from 'mobx-react-lite';
import { Navigate, useLocation } from 'react-router-dom';
import { Context } from '..';
import { MainSpinner } from './Spinners';

const RequireAuth = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const { store } = React.useContext(Context);
  const location = useLocation();

  React.useEffect(() => {
    if (localStorage.getItem('token')) {
      store.checkAuth();
    } else {
      store.setIsLoading(false);
    }
  }, []);

  if (store.isLoading) {
    return <MainSpinner />;
  }

  if (!store.isAuth) {
    return <Navigate to="/account/login" replace state={{ path: location.pathname }} />;
  }

  return <>{children}</>;
};

export default observer(RequireAuth);
