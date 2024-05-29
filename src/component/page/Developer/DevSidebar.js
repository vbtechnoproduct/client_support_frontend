import React from 'react'
import Logo from '../../../assets/images/Logo.png'
import { IoLogOutOutline, IoTicketOutline } from "react-icons/io5";
import { FaCriticalRole, FaRegUserCircle } from "react-icons/fa";
import { FaRegUser } from "react-icons/fa";
import { BiMessageDetail } from "react-icons/bi";
import { IoHomeOutline } from "react-icons/io5";
import AdminImg from '../../../assets/images/AvtarImg.png'
import { AiFillProfile } from "react-icons/ai";
import $ from 'jquery'
import { logOut } from '../../utils/Alert';
import { Link, NavLink, useNavigate } from 'react-router-dom';

export default function DevSidebar() {
    const navigate = useNavigate()
    const getDev = JSON.parse(sessionStorage.getItem("devDetails"))

    const hadndleLogout = () => {
        logOut().then((result) => {
            if (result.isConfirmed) {
                sessionStorage.clear()
                setTimeout(() => {
                    navigate("/devLogin")
                }, 500);
            }
        });
    }
    const hadnleOnClick = () => {
        const mediaQueryList = window.matchMedia("(max-width: 768px)");
        if (mediaQueryList?.matches) {
            $('.sidebarPage ').removeClass('sidebarPagemobile');
            $('.sidebarPage ').css("display", "none");
            $('#mainPageBgResponsive ').css("display", "none");
        }
    }
    return (
        <div className='sidebarPage'>
            <div className='sidebarTop'>
                <img src={getDev?.image ? getDev?.image : AdminImg} />
            </div>
            <div className='nav-show'>
                <ul>
                    <li>
                        <NavLink to='/dev/dashboard' onClick={() => hadnleOnClick()}>
                            <span className='dash-micon'>
                                <IoHomeOutline />
                            </span>
                            {/* <span className='dash-mtext'>
                                Dashboard
                            </span> */}
                        </NavLink>
                        <NavLink to="/dev/ticket" onClick={() => hadnleOnClick()}>
                            <span className='dash-micon'>
                                <IoTicketOutline />
                            </span>
                            {/* <span className='dash-mtext'>
                                Ticket
                            </span> */}
                        </NavLink>
                        <NavLink to="/dev/chat" onClick={() => hadnleOnClick()}>
                            <span className='dash-micon'>
                                <BiMessageDetail />
                            </span>
                            {/* <span className='dash-mtext'>
                                Message
                            </span> */}
                        </NavLink>
                        <NavLink to="/dev/devProfile" onClick={() => hadnleOnClick()}>
                            <span className='dash-micon'>
                                <AiFillProfile />
                            </span>
                            {/* <span className='dash-mtext'>
                                Message
                            </span> */}
                        </NavLink>
                        <Link >
                            <div onClick={() => hadndleLogout()}>

                                <span className='dash-micon'>
                                    <IoLogOutOutline />
                                </span>
                                {/* <span className='dash-mtext'>
                                    LogOut
                                </span> */}
                            </div>
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    )
}
