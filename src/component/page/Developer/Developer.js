import React, { useEffect, useState } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import Sidebar from '../Admin/Sidebar'
import Navbar from '../Admin/Navbar'
import DevDashboard from './DevDashboard'
import DevSidebar from './DevSidebar'
import DevNavbar from './DevNavbar'
import DevMessagePage from './DevMessagePage'
import notificationSound from '../../../assets/notificationSound.mp3'
import $ from 'jquery'
import { baseURL } from '../../utils/config'
import { io } from 'socket.io-client'
import DevTicketPage from './DevTicketPage'
import DevMessage from './DevMessage'
import { onMessageListener, requestForToken } from '../../api/FirebaseConfig'
import { tostMessage } from '../../extras/NotificationCom'
import { DevloperProfile } from './DevloperProfile'
import NotFoundPage from '../Admin/NotFoundPage'

export let socketRef;
export default function DevDeveloper() {
    const location = useLocation();
    const navigate = useNavigate();
    const [notificationData, setNotificationData] = useState(null);
    const [notificationLength, setNotificationLength] = useState([]);
    const getUser = JSON.parse(sessionStorage.getItem("user"))

    useEffect(() => {
        if(getUser === "dev"){
            if (
                location.pathname == "/dev" ||
                location.pathname == "/dev/" 
            ) {
                // window.location.href = "/admin/dashboard";
                // // window.history.pushState(null, null, "/admin/dashboard");
                // // window.location.reload();
                navigate("/dev/dashboard");
            }
        }
    }, [getUser]);


    useEffect(() => {
        const mediaQueryList = window.matchMedia("(max-width: 768px)");

        // Check if the media query matches
        if (mediaQueryList.matches) {
            $('.main').addClass('moPage');
        }

        // Add a listener for changes to the media query
        const listener = (event) => {
            if (event.matches) {
                $('.main').addClass('moPage');
            } else {
                $('.main').removeClass('moPage');
            }
        };
        mediaQueryList.addListener(listener);

        // Cleanup the listener when the component unmounts
        return () => {
            mediaQueryList.removeListener(listener);
        };
    }, []);

    const playRingtone = async () => {
        const audio = await new Audio(notificationSound);
        audio.play();
    };

    useEffect(() => {
        requestForToken()
    }, [])

    useEffect(() => {
        if (!("Notification" in window)) {
          console.log("This browser does not support desktop notification");
        } else {
          if (Notification.permission !== "granted") {
            Notification.requestPermission().then(permission => {
              if (permission !== "granted") {
                console.log("User denied the notification permission");
              }
            });
          }
        }
      }, []);

    useEffect(() => {
        if (location?.pathname === "/admin/message") {
            setNotificationLength([])
        }
    }, [location])



    onMessageListener()
        .then((payload) => {
            if (payload) {
                showNotificationToast(payload?.notification?.image, payload?.notification?.title, payload?.notification?.body);
                playRingtone()
                setNotificationLength((prevState) => [...prevState, payload]);
                if (Notification.permission === 'granted') {
                    const notification = new Notification(payload?.notification?.title, {
                        body: payload?.notification?.body,
                        icon: payload?.notification?.image,
                    });

                    notification.onclick = () => {
                        window.open(baseURL, '_blank');
                        notification.close();
                    };
                    setTimeout(notification.close.bind(notification), 5000);
                }
            }
        })
        .catch((err) => console.log('failed: ', err));

    const showNotificationToast = (imgShow, title, body) => {
        setNotificationData({ imgShow, title, body });
        tostMessage(imgShow, title, body)
    }

    return (
        <div>
            <DevSidebar />
            <div className='main'>
                {
                    location.pathname !== "/dev/chat" && (
                        <DevNavbar notificationCount={notificationLength} />
                    )
                }
                <div className='mainPage'>
                    <div className='mainPageBg' style={{ display: "none" }} id="mainPageBgResponsive"></div>
                    <Routes>
                        <Route path="/dashboard" element={<DevDashboard />} />
                        <Route path="/ticket" element={<DevTicketPage />} />
                        <Route path="/devProfile" element={<DevloperProfile />} />
                        <Route path="/chat" element={<DevMessage />} />
                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                </div>
            </div>
        </div>
    )
}
