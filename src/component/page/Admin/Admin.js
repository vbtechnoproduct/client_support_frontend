import React, { useEffect, useRef, useState } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import Dashboard from './Dashboard'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import MessagePage from './MessagePage'
import { io } from 'socket.io-client'
import { baseURL } from '../../utils/config'
import { useSelector } from 'react-redux'
import ClientPage from './ClientPage'
import $ from 'jquery'
import DeveloperPage from './DeveloperPage'
import TicketPage from './TicketPage'
import notificationSound from '../../../assets/notificationSound.mp3'
import NotificationComponent, { tostMessage } from '../../extras/NotificationCom'
import { AdminProfile } from './AdminProfile'
import { onMessageListener, requestForToken } from '../../api/FirebaseConfig'
import NotFoundPage from './NotFoundPage'

export let socketRef;
export default function Admin() {
    const location = useLocation();
    const navigate = useNavigate();
    const adminData = useSelector((state) => state.auth?.admin);
    const getUser = JSON.parse(sessionStorage.getItem("user"))
    // const [notificationData, setNotificationData] = useState(null);
    // const [notificationLength, setNotificationLength] = useState([]);

    useEffect(() => {
        if(getUser === "admin"){
            if (
                location.pathname == "/admin" ||
                location.pathname == "/admin/" ||
                location.pathname.includes("/dev/") 
            ) {
                // window.location.href = "/admin/dashboard";
                // // window.history.pushState(null, null, "/admin/dashboard");
                // // window.location.reload();
                navigate("/admin/dashboard");
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

    // const playRingtone = async () => {
    //     const audio = await new Audio(notificationSound);
    //     audio.play();
    // };

    // useEffect(() => {
    //     requestForToken()
    // }, [])

    // useEffect(() => {
    //     if (Notification.permission !== 'granted') {
    //         Notification.requestPermission();
    //     }
    // }, []);

    // useEffect(() => {
    //     if (location?.pathname === "/admin/message") {
    //         setNotificationLength([])
    //     }
    // }, [location])



    // onMessageListener()
    //     .then((payload) => {
    //         if (payload) {
    //             console.log("payload", payload)
    //             showNotificationToast(payload?.notification?.image, payload?.notification?.title, payload?.notification?.body);
    //             playRingtone()
    //             setNotificationLength((prevState) => [...prevState, payload]);
    //             if (Notification.permission === 'granted') {
    //                 const notification = new Notification(payload?.notification?.title, {
    //                     body: payload?.notification?.body,
    //                     icon: payload?.notification?.image,
    //                 });

    //                 notification.onclick = () => {
    //                     window.open(baseURL, '_blank');
    //                     notification.close();
    //                 };
    //                 setTimeout(notification.close.bind(notification), 5000);
    //             }
    //         }
    //     })
    //     .catch((err) => console.log('failed: ', err));

    // const showNotificationToast = (imgShow, title, body) => {
    //     setNotificationData({ imgShow, title, body });
    //     tostMessage(imgShow, title, body)
    // }

    return (
        <div>
            <Sidebar />
            <div className='main'>
                {
                    location.pathname !== "/admin/message" && (
                        <Navbar />
                    )
                }
                <div className='mainPage'>
                    <div className='mainPageBg' style={{ display: "none" }} id="mainPageBgResponsive"></div>
                    <Routes>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/client" element={<ClientPage />} />
                        <Route path="/adminProfile" element={<AdminProfile />} />
                        <Route path="/developer" element={<DeveloperPage />} />
                        <Route path="/ticket" element={<TicketPage />} />
                        <Route path="/message" element={<MessagePage />} />
                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                </div>
            </div>
        </div>
    )
}
