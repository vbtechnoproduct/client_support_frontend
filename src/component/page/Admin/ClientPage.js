import React, { useEffect, useState } from 'react'
import Title from '../../extras/Title'
import { getAllClient } from '../../redux/slice/clientSlice'
import Table from '../../extras/Table'
import $ from "jquery";
import { useDispatch, useSelector } from 'react-redux'
import dayjs from 'dayjs'
import Pagination from '../../extras/Pagination'
import Searching from '../../extras/Searching'
import { AvtarImg } from '../../extras/AvtarImg';

export default function ClientPage() {
    const [data, setData] = useState("")
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const { clientAdminData, totalClientAdmin } = useSelector((state) => state.clientAdmin);
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
        setData(clientAdminData)
    }, [clientAdminData])


    useEffect(() => {
        const payload = {
            start: page,
            limit: rowsPerPage
        }
        dispatch(getAllClient(payload))
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
                <span className='clientImg' style={{ backgroundColor: `${row?.colorCode}` }}>{row?.name?.charAt(0)?.toUpperCase()}</span>
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
    ];



    return (
        <div className='clientPage'>
            <Title name={"Client"} total={totalClientAdmin} totalShow={true} />
            <div className='row'>
                <div className='col-0 col-sm-6'>

                </div>
                <div className='col-12 col-sm-6'>
                    <Searching
                        type={`client`}
                        data={data}
                        button={true}
                        setData={setData}
                        allData={clientAdminData}
                        serverSearching={handleFilterData}
                    />
                </div>
            </div>
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
                userTotal={totalClientAdmin}
                setPage={setPage}
                handleRowsPerPage={handleRowsPerPage}
                handlePageChange={handlePageChange}
            />
        </div>
    )
}
