import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import store from "./component/redux/store";

import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import Loader from './component/utils/Loader';
import { Toaster } from 'react-hot-toast';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <App />
        <ToastContainer style={{ zIndex: "999999" }}
        />
        <Toaster
          style={{ zIndex: "999999" }}
          position="top-right"
          duration={200000000000000000000000000000000000000000000}
          reverseOrder={false}
        />
        <Loader />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
