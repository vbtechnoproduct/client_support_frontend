import React, { useEffect, useState } from 'react'
import { IoLogOutOutline, IoTicketOutline } from "react-icons/io5";
import { FaCriticalRole, FaRegUserCircle } from "react-icons/fa";
import $ from 'jquery'
import { FaRegUser } from "react-icons/fa";
import { BiMessageDetail } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { IoIosArrowForward } from "react-icons/io";
import { AiFillProfile } from "react-icons/ai";
import { RiCustomerService2Line } from "react-icons/ri";
import { IoIosArrowBack } from "react-icons/io";
import { IoHomeOutline } from "react-icons/io5";
import AdminImg from '../../../assets/images/AvtarImg.png'
import { logOut } from '../../utils/Alert';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';

export default function Sidebar() {
    const navigate = useNavigate()
    const location = useLocation()
    const getAdmin = JSON.parse(sessionStorage.getItem("admin"))
    const [sideIcon, setSideIcon] = useState(false)
    const hadndleLogout = () => {
        logOut().then((result) => {
            if (result.isConfirmed) {
                setTimeout(() => {
                    sessionStorage.clear()
                    navigate("/login")
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

    const handleIconShow = () => {
    }

    useEffect(() => {
        if (location.pathname === "/admin/message") {
            $('.sidebarPage').addClass('sideIcon');
            $('.main').addClass('sideIconMain');
            setSideIcon(true)
        }
    }, [location])

    useEffect(() => {
        if (location.pathname !== "/admin/message") {
            if (sideIcon) {
                $('.sidebarPage').addClass('sideIcon');
                $('.main').addClass('sideIconMain');
            } else {
                $('.sidebarPage').removeClass('sideIcon');
                $('.main').removeClass('sideIconMain');
            }
        }
    }, [sideIcon, location])

    return (
        <div className='sidebarPage'>
            <div className='arrowSidebar' onClick={() => setSideIcon(!sideIcon)}>
                {
                    sideIcon
                        ?
                        <IoIosArrowForward />
                        :
                        <IoIosArrowBack />
                }
            </div>
            <div className='sidebarTop'>
                <img src={AdminImg} />
                <span>{getAdmin?.name ? getAdmin?.name : " Admin"}</span>
            </div>
            <div className='nav-show'>
                <ul>
                    <li>
                        <NavLink to='/admin/dashboard' onClick={() => hadnleOnClick()}>
                            <span className='dash-micon'>
                                <IoHomeOutline />
                            </span>
                            <span className='dash-mtext'>
                                Dashboard
                            </span>
                        </NavLink>
                        <NavLink to="ticket" onClick={() => hadnleOnClick()}>
                            <span className='dash-micon'>
                                <IoTicketOutline />
                            </span>
                            <span className='dash-mtext'>
                                Ticket
                            </span>
                        </NavLink>
                        <NavLink to="client" onClick={() => hadnleOnClick()}>
                            <span className='dash-micon'>
                                <FaRegUser />
                            </span>
                            <span className='dash-mtext'>
                                Client
                            </span>
                        </NavLink>
                        <NavLink to="developer" onClick={() => hadnleOnClick()}>
                            <span className='dash-micon'>
                                <RiCustomerService2Line />
                            </span>
                            <span className='dash-mtext'>
                                Devloper
                            </span>
                        </NavLink>
                       
                        <NavLink to="/admin/message" onClick={() => hadnleOnClick()}>
                            <span className='dash-micon'>
                                <BiMessageDetail />
                            </span>
                            <span className='dash-mtext'>
                                Message
                            </span>
                        </NavLink>
                        <NavLink to="/admin/adminProfile" onClick={() => hadnleOnClick()}>
                            <span className='dash-micon'>
                                <CgProfile />
                            </span>
                            <span className='dash-mtext'>
                                Profile
                            </span>
                        </NavLink>
                        <Link >
                            <div onClick={() => hadndleLogout()}>

                                <span className='dash-micon'>
                                    <IoLogOutOutline />
                                </span>
                                <span className='dash-mtext'>
                                    LogOut
                                </span>
                            </div>
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    )
}
