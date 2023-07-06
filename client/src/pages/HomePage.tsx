import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import '../styles/HomePage.scss';
import { Context } from '..';
import { IUser } from '../types';
import { ButtonSpinner } from '../components/Spinners';

const HomePage = (): JSX.Element => {
  const [allUsers, setAllUsers] = useState<IUser[] | null>(null);
  const { store } = React.useContext(Context);
  const { isActivated } = store.user;

  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => await store.logout();
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
        <h1 className="home__heading">{`User: ${store.user.userEmail}`}</h1>
      </div>
      <div className="home__buttons">
        <button className="btn home__logout-btn" onClick={handleLogout}>
          Logout
        </button>
        <button
          className="btn home__fetch-btn"
          onClick={handleFetchUsers}
          disabled={!isActivated}
        >
          <div>
            <span>Fetch Users</span>
            {store.isLoadingUsersData ? <ButtonSpinner /> : null}
          </div>
        </button>
      </div>
      {!isActivated ? (
        <span className="home__notActivated">
          Your account has not been activated. In order to retrieve users e-mails, please
          go to your e-mail inbox and activate your account.
        </span>
      ) : null}

      {allUsers ? (
        <div className="home__content content">
          <h1 className="content__heading">All users emails:</h1>
          <ul className="content__usersList">
            {allUsers.map(({ userEmail }) => (
              <li key={userEmail}>{userEmail}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </main>
  );
};

export default observer(HomePage);
