import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Context } from '..';
import UserService from '../services/UserService';
import { IUser } from '../types';

const HomePage = (): JSX.Element => {
  const [allUsers, setAllUsers] = useState<IUser[]>([]);
  const { store } = React.useContext(Context);

  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => store.logout();
  const handleFetchUsers = async () => {
    try {
      const response = await UserService.fetchAllUsers();
      console.log(response);
      setAllUsers(response.data);
    } catch (error) {
      console.log(error);
      navigate('/account/login', { replace: true, state: { from: location } });
    }
  };

  return (
    <main>
      <h1>{store.isAuth ? `User is auth ${store.user.userEmail}` : 'Unauthorized'}</h1>
      <button onClick={handleLogout}>Logout</button>
      <button onClick={handleFetchUsers}>Fetch Users</button>
      <ul>
        {allUsers.map(({ userEmail }) => (
          <li key={userEmail}>{userEmail}</li>
        ))}
      </ul>
    </main>
  );
};

export default observer(HomePage);
