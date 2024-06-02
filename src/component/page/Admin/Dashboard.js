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

export default function Dashboard() {
    const [startDate, setStartDate] = useState("All")
    const [reopenTicketTotal, setReopenTicket] = useState(0)
    const [endDate, setEndDate] = useState("All")
    const dispatch = useDispatch()
    const dashboardCount = useSelector((state) => state.auth.dashboardCount);


    useEffect(() => {
        const payload = {
            startDate: startDate,
            endDate: endDate
        }
        dispatch(getDashboardCount(payload))
    }, [startDate, endDate])

    useEffect(() => {
        const totalReopen = dashboardCount?.totalTickets - dashboardCount?.totalOpenTickets - dashboardCount?.totalClosedTickets
        setReopenTicket(totalReopen)
    }, [dashboardCount])

    return (
        <div className='dashboard'>
            <Title name={"Dashboard"} totalShow={false} />
            <div className='row countShow'>
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

            </div>
              <div className='row'>
                <div className='col-12 col-sm-6 '>
            <div className='chartShow'>
                <TicketChart dashboardCount={dashboardCount}/>
                </div>
              </div>
            </div>
        </div>
    )
}
