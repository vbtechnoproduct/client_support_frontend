import React, { useEffect } from 'react'
import AdminImg from '../../../assets/images/AvtarImg.png'
import { useSelector } from 'react-redux';
import $ from 'jquery'
import { IoMdMenu } from "react-icons/io";
import { IoIosNotifications } from "react-icons/io";


export default function Navbar(props) {
    const { admin } = useSelector((state) => state.auth);

    const getAdmin = JSON.parse(sessionStorage.getItem("admin"))


    const hadnleShowDetailModel = () => {
        $('.sidebarPage').each(function () {
            const currentDisplay = $(this).css('display');
            const newDisplay = currentDisplay === 'none' ? 'block' : 'none';
            $(this).css('display', newDisplay);
        });
        $('#mainPageBgResponsive').each(function () {
            const currentDisplay = $(this).css('display');
            const newDisplay = currentDisplay === 'block' ? 'none' : 'block';
            $(this).css('display', newDisplay);
        });
        $('.sidebarPage').each(function () {
            if ($(this).hasClass('sidebarPagemobile')) {
                $(this).removeClass('sidebarPagemobile');
            } else {
                $(this).addClass('sidebarPagemobile');
            }
        });
    }

    return (
        <div className='navbar-page'>
            <div className='menuIconButton' style={{ display: "none" }} onClick={() => hadnleShowDetailModel()}><IoMdMenu /></div>
            <div className='row h-100'>
                <div className='col-8 col-sm-6 titleNav'>
                    <h6>Client Support</h6>
                </div>
                <div className='col-4 col-sm-6 d-flex justify-content-end align-items-center'>
                    <div className='adminProfile'>
                        <img src={getAdmin?.image ? getAdmin?.image : AdminImg} />
                        <span>{getAdmin?.name ? getAdmin?.name : " Admin"}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
