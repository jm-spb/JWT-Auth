import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './styles/App.scss';
import { MainSpinner } from './components/Spinners';
import RequireAuth from './components/RequireAuth';

const HomePage = React.lazy(() => import('./pages/HomePage'));
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const RegisterPage = React.lazy(() => import('./pages/RegisterPage'));
const ActivationMsgPage = React.lazy(() => import('./pages/ActivationMsgPage'));

const App = (): JSX.Element => (
  <div className="App">
    <React.Suspense fallback={<MainSpinner />}>
      <Routes>
        <Route
          path="/"
          element={
            <RequireAuth>
              <HomePage />
            </RequireAuth>
          }
        />
        <Route path="/account/login" element={<LoginPage />} />
        <Route path="/account/register" element={<RegisterPage />} />
        <Route path="/account/activation-message" element={<ActivationMsgPage />} />
      </Routes>
    </React.Suspense>
  </div>
);

export default App;
