import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './styles/index.scss';
import App from './App';
import Store from './store';

interface IStoreState {
  store: Store;
}

const store = new Store();
export const Context = React.createContext<IStoreState>({ store });

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <Context.Provider value={{ store }}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Context.Provider>
);
