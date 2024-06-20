import logo from './logo.svg';
import './assets/css/styles.scss'
import './assets/css/custom.scss'
import './assets/css/responsive.scss'
import "../src/assets/css/dateRange.css";
import { Navigate, Route, Routes, useParams } from 'react-router-dom';
import LoginPage from './component/page/Admin/LoginPage';
import DevLoginPage from './component/page/Developer/DevLoginPage';
import PrivateRoute from './component/utils/PrivateRoute'
import Admin from './component/page/Admin/Admin';
import Developer from './component/page/Developer/Developer';
import DevPrivateRoute from './component/utils/DevPrivateRoute';
import MessageOnePage from './component/page/MessageDevClient/MessageOnePage';
import { useEffect } from 'react';
import axios from 'axios';
import { baseURL, key } from './component/utils/config';
import { DangerRight } from './component/api/toastServices';

function App() {
  const isAuth = JSON.parse(sessionStorage.getItem("isAuth"));
  const isAuthDev = JSON.parse(sessionStorage.getItem("isAuthDev"));
  const token = sessionStorage.getItem("token");
  const getUser = JSON.parse(sessionStorage.getItem("user"))
  axios.defaults.headers.common["Authorization"] = token;
  axios.defaults.headers.common["key"] = key;
  axios.defaults.baseURL = baseURL;
  const getNotification = localStorage.getItem("notification")

  console.log("getUser", getUser)

  useEffect(() => {
    localStorage.setItem("notification", true)
  }, [])


  useEffect(() => {
    if (!("Notification" in window)) {
      console.log("This browser does not support desktop notification");
    } else {
      var options = {
        icon: 'https://placehold.it/120x120',
        body: 'body'
      };
  
      if (Notification.permission !== "granted") {
        Notification.requestPermission().then(permission => {
          if (permission !== "granted") {
            console.log("User denied the notification permission");
            if (getNotification) {
              DangerRight("Please allow Notification Permission !");
              localStorage.removeItem("notification");
            }
          } else {
            navigator.serviceWorker.ready.then(registration => {
              registration.showNotification('title', options);
            });
          }
        });
      } else {
        navigator.serviceWorker.ready.then(registration => {
          registration.showNotification('title', options);
        });
      }
    }
  }, [getNotification]);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/devLogin" element={<DevLoginPage />} />
        <Route path="/chat/:id/:otherId" element={<MessageOnePage />} />

        <Route element={<PrivateRoute />}>
          {/* {
            getUser === "dev" ?
              <Route path='/dev/*' element={<Developer />} />
              :
              <Route path="/admin/*" element={<Admin />} />
          } */}
              <Route path='/dev/*' element={<Developer />} />
              <Route path="/admin/*" element={<Admin />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
