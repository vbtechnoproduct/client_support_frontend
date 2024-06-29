import React, { useEffect, useState } from 'react'
import Title from '../../extras/Title'
import { getAllDeveloper, deleteDeveloper } from '../../redux/slice/developerSlice'
import Table from '../../extras/Table'
import $ from "jquery";
import { useDispatch, useSelector } from 'react-redux'
import dayjs from 'dayjs'
import Pagination from '../../extras/Pagination'
import Searching from '../../extras/Searching'
import { IoTrashSharp } from "react-icons/io5";
import { TiEdit } from "react-icons/ti";
import { openDialog } from '../../redux/slice/dialogueSlice'
import { FiPlus } from "react-icons/fi";
import { baseURL } from '../../utils/config'
import Button from '../../extras/Button'
import DeveloperDialogue from './dialogue/DeveloperDialogue'
import { permissionError, warning } from '../../utils/Alert'
import { AvtarImg } from '../../extras/AvtarImg';

export default function DeveloperPage() {
    const [data, setData] = useState("")
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const getAdminData = JSON.parse(sessionStorage.getItem("admin"))
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const { dialogue, dialogueType } = useSelector((state) => state.dialogue);
    const { developerAdminData, totalDeveloperAdmin } = useSelector((state) => state.developerAdmin);
    const dispatch = useDispatch()
    const getRandomAvatar = () => {
        const randomIndex = Math.floor(Math.random() * AvtarImg.length);
        return AvtarImg[randomIndex];
    };

    $(document).ready(function () {
        $("img").bind("error", function () {
            // Set the default image
            $(this).attr("src", getRandomAvatar());
        });
    });

    useEffect(() => {
        setData(developerAdminData)
    }, [developerAdminData])


    useEffect(() => {
        const payload = {
            start: page,
            limit: rowsPerPage
        }
        dispatch(getAllDeveloper(payload))
    }, [page, rowsPerPage])

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

    const hadnleEditModel = (row) => {
        if (getAdminData?.email === "demo@ticketsupport.com") {
            permissionError().then((result) => {
                if (result.isConfirmed) {

                }
            });
        } else {
            dispatch(openDialog({ type: "developer", data: row }))
        }
    }
    const hadnleNewModelOpen = () => {
        if (getAdminData?.email === "demo@ticketsupport.com") {
            permissionError().then((result) => {
                if (result.isConfirmed) {

                }
            });
        } else {
            dispatch(openDialog({ type: "developer" }))
        }
    }

    const handleDelete = (id) => {
        if (getAdminData?.email === "demo@ticketsupport.com") {
            permissionError().then((result) => {
                if (result.isConfirmed) {

                }
            });
        } else {
            warning("Delete").then((result) => {
                if (result.isConfirmed) {
                    dispatch(deleteDeveloper(id));
                }
            });
        }
    }

    const clientTable = [
        {
            Header: "No",
            body: "no",
            Cell: ({ index }) => (
                <span>{(page - 1) * rowsPerPage + parseInt(index) + 1}</span>
            ),
        },
        {
            Header: "Image",
            body: "image",
            Cell: ({ row }) => (
                <img src={row?.image} />
            ),
        },
        {
            Header: "Unique Id",
            body: "uniqueId",
            Cell: ({ row }) => (
                <span>{row?.uniqueId}</span>
            ),
        },
        {
            Header: "Pin",
            body: "pin",
            Cell: ({ row }) => (
                <span>{row?.pin}</span>
            ),
        },
        {
            Header: "Name",
            body: "name",
            Cell: ({ row }) => (
                <span>{row?.name}</span>
            ),
        },
        {
            Header: "Date",
            body: "createdAt",
            Cell: ({ row }) => (
                <span>{dayjs(row?.createdAt).format("DD MMM, YYYY")}</span>
            ),
        },
        {
            Header: "Action",
            body: "action",
            Cell: ({ row }) => (
                <div className='action-button'>
                    <Button
                        className={"editButton"}
                        onClick={() => hadnleEditModel()}
                        bIcon={<TiEdit />}
                    />
                    <Button
                        className={"deleteButton"}
                        onClick={() => handleDelete(row?._id)}
                        bIcon={<IoTrashSharp />}
                    />
                </div>
            ),
        },
    ];



    return (
        <div className='DeveloperPage'>
            <Title name={"Developer"} total={totalDeveloperAdmin} totalShow={true} />
            <div className='row mt-3 mb-3'>
                <div className='col-4 col-sm-6 d-flex align-items-center'>
                    <Button
                        text={"New"}
                        className={"newButton"}
                        onClick={() => hadnleNewModelOpen()}
                        bIcon={<FiPlus />}
                    />
                </div>
                <div className='col-8 col-sm-6'>
                    <Searching
                        type={`client`}
                        data={data}
                        button={true}
                        setData={setData}
                        allData={developerAdminData}
                        serverSearching={handleFilterData}
                    />
                </div>
            </div>
            <div className='mt-3'>
                <Table
                    data={data}
                    mapData={clientTable}
                    serverPerPage={rowsPerPage}
                    serverPage={page}
                    type={"server"}
                />
                <Pagination
                    type={"server"}
                    activePage={page}
                    rowsPerPage={rowsPerPage}
                    userTotal={totalDeveloperAdmin}
                    setPage={setPage}
                    handleRowsPerPage={handleRowsPerPage}
                    handlePageChange={handlePageChange}
                />
                {
                    dialogueType === "developer" && (
                        <DeveloperDialogue />
                    )
                }
            </div>
        </div>
    )
}
