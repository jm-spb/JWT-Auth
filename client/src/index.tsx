import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Store from './store';

interface IStoreState {
  store: Store;
}

const store = new Store();
export const Context = React.createContext<IStoreState>({ store });

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  // <React.StrictMode>
  <Context.Provider value={{ store }}>
    <App />
  </Context.Provider>,
  // </React.StrictMode>,
);
