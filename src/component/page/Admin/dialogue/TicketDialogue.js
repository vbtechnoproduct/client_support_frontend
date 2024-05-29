import React, { useEffect, useState } from 'react'
import { IoCloseSharp } from "react-icons/io5";
import Input from '../../../extras/Input';
import { closeDialog, openDialog } from '../../../redux/slice/dialogueSlice';
import Button from '../../../extras/Button';
import ReactSelect from "react-select";

import { createTicket, getAllDeveloper } from '../../../redux/slice/ticketSlice'
import { useDispatch, useSelector } from 'react-redux';
import { requestForToken } from '../../../api/FirebaseConfig';


export default function TicketDialogue() {
    const bgProfileColor = ["rgb(255, 58, 110)", "rgb(108, 117, 125", "rgb(255, 162, 29)", "rgb(111, 217, 67)"]
    const [name, setName] = useState("");
    const [appName, setAppName] = useState("");
    const [issueDescription, setIssueDescription] = useState("");
    const [developerSelect, setDeveloperSelect] = useState("");

    const dispatch = useDispatch()
    const { dialogue, dialogueData, dialogueType } = useSelector((state) => state.dialogue);
    const { developerAdminData } = useSelector((state) => state.ticketAdmin);



    const [error, setError] = useState({
        clientName: "",
        appName: "",
        issueDescription: "",
        developerSelect: ""
    });

    useEffect(() => {
        setName("")
    }, [dialogue])

    useEffect(() => {
        setName(dialogueData?.name)
    }, [dialogueData])

    useEffect(() => {
        dispatch(getAllDeveloper())
    }, [])


    const CustomOption = ({ innerProps, label, data }) => (
        <div {...innerProps} className="select-optionList"  >
            <img src={data?.image && data?.image} alt={label} />
            <span>{data?.name && data?.name}</span>
        </div>
    );


    const handleSelectChange = (selected) => {
        setDeveloperSelect(selected);
        if (!selected) {
            return setError({
                ...error,
                developerSelect: `Developer Is Required`,
            });
        } else {
            return setError({
                ...error,
                developerSelect: "",
            });
        }
    };

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function getRandomColor(colors) {
        const randomIndex = Math.floor(Math.random() * colors.length);
        return colors[randomIndex];
    }
    const shuffledColors = shuffleArray(bgProfileColor);
    const backgroundColorData = getRandomColor(shuffledColors);

    const handleSubmit = async (image) => {
        const getFcmToken = JSON.parse(sessionStorage.getItem("FCMToken"))
        if (!name || !developerSelect || !appName || !issueDescription
        ) {
            let error = {};
            if (!name) error.clientName = "Client Name is Required"
            if (!developerSelect) error.developerSelect = "Developer is Required"
            if (!appName) error.appName = "App Name is Required"
            if (!issueDescription) error.issueDescription = "Issue Description is Required"

            return setError({ ...error })
        } else {

            const getData = {
                clientName: name,
                developer: developerSelect?._id,
                appName: appName,
                issueDescription: issueDescription,
                colorCode: backgroundColorData,
                fcmToken: getFcmToken
            }
            let payload = {
                data: getData,
            }
            let response = await dispatch(createTicket(payload)).unwrap();
            if (response?.data?.status) {
                dispatch(closeDialog({ type: "ticket" }))
                dispatch(openDialog({ type: "ticketView", data: response?.data }))
            } else {
                dispatch(closeDialog({ type: "ticket" }))
            }
        }
    };

    return (
        <div className='dialog DeveloperDialog TicketDialog'>
            <div className='mainDiaogBox'>
                <div className='dialogHead'>
                    <h6>Create New  Ticket</h6>
                    <IoCloseSharp onClick={() => dispatch(closeDialog({ type: "ticket" }))} />
                </div>
                <div className='dialogBody'>
                    <div className='mb-3'>
                        <Input
                            type={`text`}
                            id={`appName`}
                            name={`appName`}
                            label={`App Name`}
                            value={appName}
                            placeholder={`App Name`}
                            errorMessage={error.appName && error.appName}
                            onChange={(e) => {
                                setAppName(e.target.value);
                                if (!e.target.value) {
                                    return setError({
                                        ...error,
                                        appName: `App Name is Required`,
                                    });
                                } else {
                                    return setError({
                                        ...error,
                                        appName: "",
                                    });
                                }
                            }}
                        />
                    </div>

                    <div className='mb-3'>
                        <Input
                            type={`text`}
                            id={`name`}
                            name={`name`}
                            label={`Client Name`}
                            value={name}
                            placeholder={`Client Name`}
                            errorMessage={error.clientName && error.clientName}
                            onChange={(e) => {
                                setName(e.target.value);
                                if (!e.target.value) {
                                    return setError({
                                        ...error,
                                        name: `Client Name is Required`,
                                    });
                                } else {
                                    return setError({
                                        ...error,
                                        name: "",
                                    });
                                }
                            }}
                        />
                    </div>
                    <div className='mb-3 custom-select'>
                        <label>Developer</label>
                        <ReactSelect
                            options={developerAdminData || []}
                            value={developerSelect}
                            isClearable={false}
                            onChange={(selected) => handleSelectChange(selected)}
                            getOptionValue={(option) => option?.name}
                            formatOptionLabel={(option) => (
                                <div className="optionShow-option">
                                    <img
                                        src={option?.image ? option?.image : ""}
                                    />
                                    <span>
                                        {option?.name ? option?.name : ""}
                                    </span>
                                </div>
                            )}
                            components={{
                                Option: CustomOption,
                            }}
                        />
                        {
                            error.developerSelect && (
                                <p className="errorMessage">{error.developerSelect && error.developerSelect}</p>
                            )
                        }
                    </div>
                    <div className='mb-3 textArea'>
                        <label className="label-form">Issue Description</label>
                        <textarea
                            cols={6}
                            rows={6}
                            label={"Issue Description"}
                            name={"issueDescription"}
                            placeholder={"Enter Description ..."}
                            onChange={(e) => {
                                setIssueDescription(e.target.value);
                                if (!e.target.value) {
                                    return setError({
                                        ...error,
                                        issueDescription: `Description Is Required`,
                                    });
                                } else {
                                    return setError({
                                        ...error,
                                        issueDescription: "",
                                    });
                                }
                            }}
                        ></textarea>
                        {error.issueDescription && (
                            <p className="errorMessage">
                                {error.issueDescription && error.issueDescription}
                            </p>
                        )}
                    </div>
                </div>
                <div className='dialog-footer'>
                    <Button
                        text={"Cancel"}
                        className={"cancelButton"}
                        onClick={() => dispatch(closeDialog({ type: "developer" }))}
                    />
                    <Button
                        text={"Submit"}
                        type={"button"}
                        className={"submitButton"}
                        onClick={handleSubmit}
                    />
                </div>

            </div>
        </div>
    )
}
