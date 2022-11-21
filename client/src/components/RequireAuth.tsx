import React from 'react';
import { observer } from 'mobx-react-lite';
import { Navigate, useLocation } from 'react-router-dom';
import { Context } from '..';
import Spinner from './Spinner';

const RequireAuth = ({ children }: { children: React.ReactNode }): JSX.Element => {
  console.log('Require Auth');
  const { store } = React.useContext(Context);
  const location = useLocation();

  React.useEffect(() => {
    if (localStorage.getItem('token')) {
      console.log('hi');
      store.checkAuth();
    } else {
      store.setIsLoading(false);
    }
  }, []);

  console.log(store.isAuth);
  console.log(store.isLoading);

  if (store.isLoading) {
    return <Spinner />;
  }

  if (!store.isAuth) {
    return <Navigate to="/account/login" replace state={{ path: location.pathname }} />;
  }

  return <>{children}</>;
};

export default observer(RequireAuth);
