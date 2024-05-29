import React, { useEffect, useState } from 'react'
import Title from '../../extras/Title'
import { getDevTicket, reopenTicket } from '../../redux/slice/ticketSlice'
import Table from '../../extras/Table'
import AvtarImg from '../../../assets/images/AvtarImg.png'
import $ from "jquery";
import { useDispatch, useSelector } from 'react-redux'
import dayjs from 'dayjs'
import Pagination from '../../extras/Pagination'
import Searching from '../../extras/Searching'
import { IoTrashSharp } from "react-icons/io5";
import { TiEdit } from "react-icons/ti";
import { GrFormView } from "react-icons/gr";
import { GoIssueReopened } from "react-icons/go";
import { openDialog } from '../../redux/slice/dialogueSlice'
import { FiPlus } from "react-icons/fi";
import { baseURL } from '../../utils/config'
import Button from '../../extras/Button'
import { warning } from '../../utils/Alert'
import { IoIosCopy } from "react-icons/io";
import TicketView from '../Admin/dialogue/TicketView'
import { Success } from '../../api/toastServices'
import Analytics from '../../extras/Analytics'

export default function DevTicketPage() {
    const [data, setData] = useState("")
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [startDate, setStartDate] = useState("All");
    const [status, setStatus] = useState("All");
    const [endDate, setEndDate] = useState("All");
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const { dialogue, dialogueType } = useSelector((state) => state.dialogue);
    const { ticketDevAdmin, ticketDevData, developerAdminData } = useSelector((state) => state.ticketAdmin);
    const dispatch = useDispatch()


    $(document).ready(function () {
        $("img").bind("error", function () {
            // Set the default image
            $(this).attr("src", AvtarImg);
        });
    });
    const getDevId = JSON.parse(sessionStorage.getItem("devDetails"))

    useEffect(() => {
        setData(ticketDevData)
    }, [ticketDevData])


    useEffect(() => {
        if (getDevId?._id) {
            const payload = {
                start: page,
                limit: rowsPerPage,
                startDate: startDate,
                endDate: endDate,
                status: status,
                developer: getDevId?._id
            }
            dispatch(getDevTicket(payload))
        }
    }, [page, rowsPerPage, startDate, endDate])

    const handlePageChange = (pageNumber) => {
        setPage(pageNumber);
    };

    const handleRowsPerPage = (value) => {
        setPage(1);
        setRowsPerPage(value);
    };
    const handleFilterData = (filteredData) => {
        if (typeof filteredData === "string") {
            setSearch(filteredData);
        } else {
            setData(filteredData);
        }
    };

    const hadnleCopyText = (ticketId) => {
        navigator.clipboard.writeText(ticketId)
        Success("Ticket copied")
    }

    const handleReopenTicket = (row) => {
        const payload = {
            clientId: row?.client?._id,
            id: row?._id
        }
        dispatch(reopenTicket(payload))
    }

    const handleDelete = (id) => {
        warning("Delete").then((result) => {
            if (result.isConfirmed) {
                // dispatch(deleteDeveloper(id));
            }
        });
    }

    const hadnleViewTicket = (data) => {
        dispatch(openDialog({ type: "ticketView", data: data }))
    }

    const ticketTable = [
        {
            Header: "No",
            body: "no",
            Cell: ({ index }) => (
                <span>{(page - 1) * rowsPerPage + parseInt(index) + 1}</span>
            ),
        },
        {
            Header: "Ticket Id",
            body: "ticketId",
            Cell: ({ row }) => (
                <div className='copyText'>
                    <span >{row?.ticketId}</span>
                    {/* <Button
                        onClick={() => hadnleCopyText(row?.ticketId)}
                        bIcon={<IoIosCopy />}
                    /> */}
                </div>
            ),
        },
        {
            Header: "Client Name",
            body: "clientName",
            Cell: ({ row }) => (
                <span>{row?.client?.name}</span>
            ),
        },
        {
            Header: "App Name",
            body: "appName",
            Cell: ({ row }) => (
                <span>{row?.appName}</span>
            ),
        },
        {
            Header: "Issue Description",
            body: "issueDescription",
            Cell: ({ row }) => (
                <div className='discripton'><span>{row?.issueDescription}</span></div>
            ),
        },
        {
            Header: "Status",
            body: "status",
            Cell: ({ row }) => (
                <div className='statusButton d-flex justify-content-center'>
                    {
                        row?.status === 1 ?
                            <span className='openTicket  badge'>Open</span>
                            : row?.status === 2 ?
                                <span className='closedTicket badge'>Closed</span>
                                :
                                <span className='reopenTicket badge'>Reopen</span>
                    }
                </div>
            ),
        },

        // {
        //     Header: "Reopen",
        //     body: "action",
        //     Cell: ({ row }) => (
        //         <div className='action-button'>
        //             <Button
        //                 className={"reOpen"}
        //                 disabled={row?.status === 3 ? false : true}
        //                 onClick={() => handleReopenTicket(row)}
        //                 bIcon={<GoIssueReopened />}
        //                 style={{ opacity: `${row?.status === 3 ? "1" : "0.6"}` }}
        //             />
        //         </div>
        //     ),
        // },
        {
            Header: "View",
            body: "action",
            Cell: ({ row }) => (
                <div className='action-button'>
                    <Button
                        className={" viewButton"}
                        onClick={() => hadnleViewTicket(row)}
                        bIcon={<GrFormView />}
                        style={{}}
                    />
                </div>
            ),
        },
        {
            Header: "Date",
            body: "Date",
            Cell: ({ row }) => (
                <span>{dayjs(row?.createdAt).format("DD MMM, YYYY")}</span>
            ),
        },
    ];



    return (
        <div className='TicketPage'>
            <Title name={"Ticket"} total={ticketDevAdmin} totalShow={true} />
            <div className='row mt-3 mb-1 searchButtonShow'>
                <div className='col-12 col-md-6 d-flex align-items-center searchButtonButton'>
                    <Analytics
                        dayAnalyticsShow={true}
                        setEndDate={setEndDate}
                        setStartDate={setStartDate}
                        startDate={startDate}
                        endDate={endDate}
                    />
                </div>
                <div className='col-12 col-md-6 '>
                    <Searching
                        type={`client`}
                        data={data}
                        button={true}
                        setData={setData}
                        allData={ticketDevData}
                        serverSearching={handleFilterData}
                    />

                </div>

            </div>
            <div className='mt-0'>
                <div className='row'>
                    <div className='col-6'></div>

                </div>
                <Table
                    data={data}
                    mapData={ticketTable}
                    serverPerPage={rowsPerPage}
                    serverPage={page}
                    type={"server"}
                />
                <Pagination
                    type={"server"}
                    activePage={page}
                    rowsPerPage={rowsPerPage}
                    userTotal={ticketDevAdmin}
                    setPage={setPage}
                    handleRowsPerPage={handleRowsPerPage}
                    handlePageChange={handlePageChange}
                />
                {
                    dialogueType === "ticketView" && (
                        <TicketView />
                    )
                }
            </div>
        </div>
    )
}
