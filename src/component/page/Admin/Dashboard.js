import React, { useEffect, useState } from 'react'
import { getDashboardCount } from '../../redux/slice/authSlice'
import Title from '../../extras/Title'
import { FaRectangleList } from "react-icons/fa6";
import { IoTicketSharp } from "react-icons/io5";
import { FaTicket } from "react-icons/fa6";
import { GoIssueReopened } from "react-icons/go";
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import TicketChart from '../../extras/TicketChart';
import { getAllDeveloper } from '../../redux/slice/ticketSlice';

export default function Dashboard() {
    const [startDate, setStartDate] = useState("All")
    const [reopenTicketTotal, setReopenTicket] = useState(0)
    const [endDate, setEndDate] = useState("All")
    const dispatch = useDispatch()
    const dashboardCount = useSelector((state) => state.auth.dashboardCount);
    const { developerAdminData } = useSelector((state) => state.ticketAdmin);


    useEffect(() => {
        const payload = {
            startDate: startDate,
            endDate: endDate
        }
        dispatch(getDashboardCount(payload))
    }, [startDate, endDate])

    useEffect(() => {
        dispatch(getAllDeveloper())
    }, [])
    useEffect(() => {
        console.log("developerAdminData", developerAdminData)
    }, [developerAdminData])
    useEffect(() => {
        const totalReopen = dashboardCount?.totalTickets - dashboardCount?.totalOpenTickets - dashboardCount?.totalClosedTickets
        setReopenTicket(totalReopen)
    }, [dashboardCount])

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
                <div className='col-12 col-lg-6 '>
                    <div className='chartShow'>
                        <h6>Tickets Chart</h6>
                        <TicketChart dashboardCount={dashboardCount} />
                    </div>
                </div>
                <div className='col-12 mt-3 mt-lg-0 col-lg-6 '>
                    <div className='developerBox'>
                        <h6>Developer</h6>
                        <div className='tableShowMain'>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Unique Id</th>
                                        <th>Pin</th>
                                        <th>Is Online</th>
                                        <th>Last Login</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        developerAdminData?.map((item) => {
                                            return (
                                                <>
                                                    <tr>
                                                        <td>
                                                            <div className='showNameImg'>
                                                                <div className="imgShow">
                                                                    <img src={item?.image} />
                                                                </div>
                                                                <span>{item?.name}</span>
                                                            </div>
                                                        </td>
                                                        <td>{item?.uniqueId}</td>
                                                        <td>{item?.pin}</td>
                                                        <td>
                                                            <div className='d-flex justify-content-center align-items-center'>
                                                                <div className={`online-indicator ${item?.isOnline === true ? "isOnline" : "isOffline"}`}>
                                                                    <span class="blink"></span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>{item?.lastLogin}</td>
                                                    </tr>
                                                </>
                                            )
                                        })
                                    }
                                    <tr>

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
