import React from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from '.';
import LoginForm from './components/LoginForm';
import './styles.css';

function App() {
  const { store } = React.useContext(Context);
  React.useEffect(() => {
    if (localStorage.getItem('token')) {
      console.log('hi');
      store.checkAuth();
    }
  }, []);

  if (store.isLoading) {
    return <div>Loading...</div>;
  }

  if (!store.isAuth) {
    return (
      <div className="App">
        <LoginForm />
      </div>
    );
  }

  const handleLogout = () => store.logout();

  return (
    <div className="App">
      <h1>{store.isAuth ? `User is auth ${store.user.email}` : 'Unauthorized'}</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default observer(App);
