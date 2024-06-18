import React, { useEffect, useState } from 'react'
import { getDashboardCount, updateDeveloperDev } from '../../redux/devSlice/devAuthSlice'
import Title from '../../extras/Title'
import { FaRectangleList } from "react-icons/fa6";
import { IoTicketSharp } from "react-icons/io5";
import { FaTicket } from "react-icons/fa6";
import { GoIssueReopened } from "react-icons/go";
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { requestForToken } from '../../api/FirebaseConfig';
import TicketChart from '../../extras/TicketChart';
import { getAllDeveloper } from '../../redux/slice/ticketSlice';

export default function DevDashboard() {
    const [startDate, setStartDate] = useState("All")
    const [endDate, setEndDate] = useState("All")
    const dispatch = useDispatch()
    const [reopenTicketTotal, setReopenTicket] = useState(0)
    const dashboardCount = useSelector((state) => state.devAuth.dashboardCount);
    const getFcmToken = JSON.parse(sessionStorage.getItem("FCMToken"))
    const devDetailsGet = JSON.parse(sessionStorage.getItem("devDetails"))
    const { developerAdminData } = useSelector((state) => state.ticketAdmin);

    useEffect(() => {
        const payload = {
            startDate: startDate,
            endDate: endDate,
            developer: devDetailsGet?._id
        }
        dispatch(getDashboardCount(payload))
    }, [startDate, endDate])
    useEffect(() => {
        dispatch(getAllDeveloper())
    }, [])
    useEffect(() => {
        requestForToken()
    }, [])

    useEffect(() => {
        const totalReopen = dashboardCount?.totalTickets - dashboardCount?.totalOpenTickets - dashboardCount?.totalClosedTickets
        setReopenTicket(totalReopen)
    }, [dashboardCount])


    useEffect(() => {
        const formData = new FormData();
        formData.append("fcmToken", getFcmToken);

        if (devDetailsGet && getFcmToken) {
            const payload = {
                id: devDetailsGet?._id,
                data: formData,
                shoTost: false,
            }
            dispatch(updateDeveloperDev(payload))
        }
    }, [devDetailsGet, getFcmToken])

    return (
        <div className='dashboard'>
            <Title name={"Hi, Welcome back 👋"} totalShow={false} />
            {/* <div className='row countShow'>
            <div className='col-12 col-sm-6 col-md-6  p-1'>
                <NavLink style={{ textDecoration: "none" }} to={"/admin/ticket"}>
                    <div className='countShowBox'>
                        <div className='iconShow' style={{ backgroundColor: "rgb(255, 58, 110)" }}>
                            <FaRectangleList />
                        </div>
                        <div className='textShowDash'>
                            <h6>Total Tickets</h6>
                            <h5>{dashboardCount?.totalTickets ? dashboardCount?.totalTickets : "0"}</h5>
                        </div>
                    </div>
                </NavLink>
            </div>
            <div className='col-12 col-sm-6 col-md-6  p-1'>
                <NavLink style={{ textDecoration: "none" }} to={"/admin/ticket"}>
                    <div className='countShowBox'>
                        <div className='iconShow' style={{ backgroundColor: "rgb(62, 201, 214)" }}>
                            <FaTicket />
                        </div>
                        <div className='textShowDash'>
                            <h6>Total Open Tickets</h6>
                            <h5>{dashboardCount?.totalOpenTickets ? dashboardCount?.totalOpenTickets : "0"}</h5>
                        </div>
                    </div>
                </NavLink>
            </div>
            <div className='col-12 col-sm-6 col-md-6  p-1 mt-sm-2 mt-lg-0' >
                <NavLink style={{ textDecoration: "none" }} to={"/admin/ticket"}>
                    <div className='countShowBox'>
                        <div className='iconShow' style={{ backgroundColor: "rgb(255, 162, 29)" }}>
                            <GoIssueReopened />
                        </div>
                        <div className='textShowDash'>
                            <h6>Total Reopen Tickets</h6>
                            <h5>{reopenTicketTotal ? reopenTicketTotal : "0"}</h5>
                        </div>
                    </div>
                </NavLink>
            </div>
            <div className='col-12 col-sm-6 col-md-6  p-1 mt-sm-2  mt-lg-0'>
                <NavLink style={{ textDecoration: "none" }} to={"/admin/ticket"}>
                    <div className='countShowBox'>
                        <div className='iconShow' style={{ backgroundColor: "red" }}>
                            <IoTicketSharp />
                        </div>
                        <div className='textShowDash'>
                            <h6>Total Closed Tickets</h6>
                            <h5>{dashboardCount?.totalClosedTickets ? dashboardCount?.totalClosedTickets : "0"}</h5>
                        </div>
                    </div>
                </NavLink>
            </div>

        </div> */}
            <div className='row'>
                <div className='col-12 col-sm-6 col-md-6 col-xl-3  p-1 mt-sm-2 mt-lg-0  d-flex justify-content-centerd'>
                    <div className='newCard'>
                        <div className='d-flex align-items-center justify-content-between'>
                            <div className='textShow'>
                                <div className='iconSvg'> <FaRectangleList /></div>
                                <h6>Total Tickets</h6>
                            </div>
                            <h5>{dashboardCount?.totalTickets ? dashboardCount?.totalTickets : "0"}</h5>
                        </div>
                        <div className='showCardBg'></div>
                    </div>
                </div>
                <div className='col-12 col-sm-6 col-md-6 col-xl-3  p-1 mt-sm-2 mt-lg-0  d-flex justify-content-centerd'>
                    <div className='newCard newCard2'>
                        <div className='d-flex align-items-center justify-content-between'>
                            <div className='textShow'>
                                <div className='iconSvg'> <FaTicket /></div>
                                <h6>Total Open Tickets</h6>
                            </div>
                            <h5>{dashboardCount?.totalOpenTickets ? dashboardCount?.totalOpenTickets : "0"}</h5>
                        </div>
                        <div className='showCardBg'></div>
                    </div>
                </div>
                <div className='col-12 col-sm-6 col-md-6 col-xl-3  p-1 mt-sm-2 mt-lg-0  d-flex justify-content-centerd'>
                    <div className='newCard newCard3'>
                        <div className='d-flex align-items-center justify-content-between'>
                            <div className='textShow'>
                                <div className='iconSvg'> <GoIssueReopened /></div>
                                <h6>Total Reopen Tickets</h6>
                            </div>
                            <h5>{reopenTicketTotal ? reopenTicketTotal : "0"}</h5>
                        </div>
                        <div className='showCardBg'></div>
                    </div>
                </div>
                <div className='col-12 col-sm-6 col-md-6 col-xl-3  p-1 mt-sm-2 mt-lg-0  d-flex justify-content-centerd'>
                    <div className='newCard newCar4'>
                        <div className='d-flex align-items-center justify-content-between'>
                            <div className='textShow'>
                                <div className='iconSvg'> <IoTicketSharp /></div>
                                <h6>Total Closed Tickets</h6>
                            </div>
                            <h5>{dashboardCount?.totalClosedTickets ? dashboardCount?.totalClosedTickets : "0"}</h5>
                        </div>
                        <div className='showCardBg'></div>
                    </div>
                </div>
            </div>
            <div className='row'>
                <div className='col-12 col-xl-6 '>
                    <div className='chartShow'>
                        <h6>Tickets Chart</h6>
                        <TicketChart dashboardCount={dashboardCount} />
                    </div>
                </div>
                <div className='col-12 mt-3 mt-xl-0 col-xl-6 '>
                    <div className='developerBox'>
                        <h6>Client</h6>
                        <div className='tableShowMain devTable'>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Is Online</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <div className='showNameImg devName'>
                                                <div className="imgShow">
                                                    <span
                                                        className="nameImgProfile"
                                                        style={{
                                                            backgroundColor: "#00B8D9",
                                                        }}
                                                    >
                                                        {"Amiah Pruitt"
                                                            ? "Amiah Pruitt"?.charAt(0)
                                                            : ""}
                                                    </span>
                                                </div>
                                                <span>Amiah Pruitt</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className='d-flex justify-content-start align-items-center'>
                                                <div className={`online-indicator ${false ? "isOnline" : "isOffline"}`}>
                                                    <span class="blink"></span>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div className='showNameImg devName'>
                                                <div className="imgShow">
                                                    <span
                                                        className="nameImgProfile"
                                                        style={{
                                                            backgroundColor: "#B71D18",
                                                        }}
                                                    >
                                                        {"Gelique Morse"
                                                            ? "Gelique Morse"?.charAt(0)
                                                            : ""}
                                                    </span>
                                                </div>
                                                <span>Gelique Morse</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className='d-flex justify-content-start align-items-center'>
                                                <div className={`online-indicator ${false ? "isOnline" : "isOffline"}`}>
                                                    <span class="blink"></span>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div className='showNameImg devName'>
                                                <div className="imgShow">
                                                    <span
                                                        className="nameImgProfile"
                                                        style={{
                                                            backgroundColor: "#637381",
                                                        }}
                                                    >
                                                        {"Cortez Herring"
                                                            ? "Cortez Herring"?.charAt(0)
                                                            : ""}
                                                    </span>
                                                </div>
                                                <span>Cortez Herring</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className='d-flex justify-content-start align-items-center'>
                                                <div className={`online-indicator ${false ? "isOnline" : "isOffline"}`}>
                                                    <span class="blink"></span>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
