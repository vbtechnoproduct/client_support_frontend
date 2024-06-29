import React, { useEffect, useState } from 'react'
import Title from '../../extras/Title'
import { getTicket, reopenTicket } from '../../redux/slice/ticketSlice'
import Table from '../../extras/Table'
import AvtarImg from '../../../assets/images/AvtarImg.png'
import $ from "jquery";
import { useDispatch, useSelector } from 'react-redux'
import dayjs from 'dayjs'
import Pagination from '../../extras/Pagination'
import Searching from '../../extras/Searching'
import { IoTrashSharp } from "react-icons/io5";
import { FaEdit } from "react-icons/fa";
import { TiEdit } from "react-icons/ti";
import { GrFormView } from "react-icons/gr";
import { GoIssueReopened } from "react-icons/go";
import { openDialog } from '../../redux/slice/dialogueSlice'
import { FiPlus } from "react-icons/fi";
import { baseURL } from '../../utils/config'
import Button from '../../extras/Button'
import DeveloperDialogue from './dialogue/DeveloperDialogue'
import { permissionError, warning } from '../../utils/Alert'
import { IoIosCopy } from "react-icons/io";
import TicketDialogue from './dialogue/TicketDialogue'
import TicketView from './dialogue/TicketView'
import { Success } from '../../api/toastServices'
import Analytics from '../../extras/Analytics'
import TicketDialogueDeveloperEdit from './dialogue/TicketDialogueDeveloperEdit'

export default function TicketPage() {
    const [data, setData] = useState("")
    const getAdminData = JSON.parse(sessionStorage.getItem("admin"))
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [startDate, setStartDate] = useState("All");
    const [status, setStatus] = useState("All");
    const [endDate, setEndDate] = useState("All");
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const { dialogue, dialogueType } = useSelector((state) => state.dialogue);
    const { ticketTotalAdmin, ticketAdminData, developerAdminData } = useSelector((state) => state.ticketAdmin);
    const dispatch = useDispatch()


    $(document).ready(function () {
        $("img").bind("error", function () {
            // Set the default image
            $(this).attr("src", AvtarImg);
        });
    });

    useEffect(() => {
        setData(ticketAdminData)
    }, [ticketAdminData])


    useEffect(() => {
        const payload = {
            start: page,
            limit: rowsPerPage,
            startDate: startDate,
            endDate: endDate,
            status: status
        }
        dispatch(getTicket(payload))
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
        if (getAdminData?.email === "demo@ticketsupport.com") {
            permissionError().then((result) => {
                if (result.isConfirmed) {

                }
            });
        } else {
            const payload = {
                clientId: row?.client?._id,
                id: row?._id
            }
            dispatch(reopenTicket(payload))
        }
    }

    const handleDelete = (id) => {
        warning("Delete").then((result) => {
            if (result.isConfirmed) {
                // dispatch(deleteDeveloper(id));
            }
        });
    }

    const hadnleViewTicket = (data) => {
        if (getAdminData?.email === "demo@ticketsupport.com") {
            permissionError().then((result) => {
                if (result.isConfirmed) {

                }
            });
        } else {
            dispatch(openDialog({ type: "ticketView", data: data }))
        }
    }

    const hadleNewTicketModel = () => {
        if (getAdminData?.email === "demo@ticketsupport.com") {
            permissionError().then((result) => {
                if (result.isConfirmed) {

                }
            });
        } else {
            dispatch(openDialog({ type: "ticket" }))
        }
    }

    const hadnleEdit = (data) => {
        if (getAdminData?.email === "demo@ticketsupport.com") {
            permissionError().then((result) => {
                if (result.isConfirmed) {

                }
            });
        } else {
            dispatch(openDialog({ type: "editTicket", data: data }))
        }
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
            Header: "Developer Name",
            body: "developerName",
            Cell: ({ row }) => (
                <span>{row?.developer?.name}</span>
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
        {
            Header: "Edit",
            body: "edit",
            Cell: ({ row }) => (
                <div className='action-button'>
                    <Button
                        className={"edit"}
                        style={{ backgroundColor: "rgb(29 104 46)" }}
                        onClick={() => hadnleEdit(row)}
                        bIcon={<FaEdit style={{ width: "14px", height: "14px" }} />}
                    />
                </div>
            ),
        },
        {
            Header: "Reopen",
            body: "action",
            Cell: ({ row }) => (
                <div className='action-button'>
                    <Button
                        className={"reOpen"}
                        disabled={row?.status === 2 ? false : true}
                        onClick={() => handleReopenTicket(row)}
                        bIcon={<GoIssueReopened />}
                        style={{ opacity: `${row?.status === 2 ? "1" : "0.6"}` }}
                    />
                </div>
            ),
        },
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
            <Title name={"Ticket"} total={ticketTotalAdmin} totalShow={true} />
            <div className='row mt-3 mb-1'>
                <div className='col-12 col-md-6 d-flex align-items-center anlyticsButton'>
                    <Button
                        text={"New"}
                        className={"newButton"}
                        style={{ marginRight: "16px" }}
                        onClick={() => hadleNewTicketModel()}
                        bIcon={<FiPlus />}
                    />
                    <Analytics
                        dayAnalyticsShow={true}
                        setEndDate={setEndDate}
                        setStartDate={setStartDate}
                        startDate={startDate}
                        endDate={endDate}
                    />
                </div>
                <div className='col-12 col-md-6'>
                    <Searching
                        type={`client`}
                        data={data}
                        button={true}
                        setData={setData}
                        allData={ticketAdminData}
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
                    userTotal={ticketTotalAdmin}
                    setPage={setPage}
                    handleRowsPerPage={handleRowsPerPage}
                    handlePageChange={handlePageChange}
                />
                {
                    dialogueType === "ticket" && (
                        <TicketDialogue />
                    )
                }
                {
                    dialogueType === "ticketView" && (
                        <TicketView />
                    )
                }
                {
                    dialogueType === "editTicket" && (
                        <TicketDialogueDeveloperEdit />
                    )
                }
            </div>
        </div>
    )
}
