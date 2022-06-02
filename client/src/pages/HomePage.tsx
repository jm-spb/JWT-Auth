import React from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from '..';
import Spinner from '../components/Spinner';

const HomePage = (): JSX.Element => {
  React.useEffect(() => {
    if (localStorage.getItem('token')) {
      console.log('hi');
      store.checkAuth();
    }
  }, []);

  const { store } = React.useContext(Context);

  if (store.isLoading) {
    return <Spinner />;
  }

  const handleLogout = () => store.logout();

  return (
    <main>
      <h1>{store.isAuth ? `User is auth ${store.user.userEmail}` : 'Unauthorized'}</h1>
      <button onClick={handleLogout}>Logout</button>
    </main>
  );
};

export default observer(HomePage);
