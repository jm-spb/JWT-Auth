import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import '../styles/HomePage.scss';
import { Context } from '..';
import { IUser } from '../types';
import { ButtonSpinner } from '../components/Spinners';

const HomePage = (): JSX.Element => {
  const [allUsers, setAllUsers] = useState<IUser[]>([]);
  const { store } = React.useContext(Context);

  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => store.logout();

  const handleFetchUsers = async () => {
    const response = await store.fetchUsers();
    if (response) {
      setAllUsers(response);
    } else {
      navigate('/account/login', { replace: true, state: { from: location } });
    }
  };

  return (
    <main className="home">
      <div className="home__top">
        <h1 className="home__heading">
          {store.isAuth ? `User: ${store.user.userEmail}` : 'Unauthorized'}
        </h1>
      </div>
      <div className="home__buttons">
        <button className="btn" onClick={handleLogout}>
          Logout
        </button>
        <button className="btn home__fetch-btn" onClick={handleFetchUsers}>
          <span className="btn__content">
            <span>Fetch Users</span>
            {store.isLoadingUsersData ? <ButtonSpinner /> : null}
          </span>
        </button>
      </div>
      <div className="home__content">
        <ul>
          {allUsers.map(({ userEmail }) => (
            <li key={userEmail}>{userEmail}</li>
          ))}
        </ul>
      </div>
    </main>
  );
};

export default observer(HomePage);
