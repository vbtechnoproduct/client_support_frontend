import React, { useEffect, useState } from 'react'
import { IoCloseSharp } from "react-icons/io5";
import Input from '../../../extras/Input';
import { closeDialog, openDialog } from '../../../redux/slice/dialogueSlice';
import Button from '../../../extras/Button';
import ReactSelect from "react-select";

import { createTicket, getAllDeveloper, updateTicketDeveloper } from '../../../redux/slice/ticketSlice'
import { useDispatch, useSelector } from 'react-redux';
import { requestForToken } from '../../../api/FirebaseConfig';


export default function TicketDialogueDeveloperEdit() {
    const bgProfileColor = ["rgb(255, 58, 110)", "rgb(108, 117, 125", "rgb(255, 162, 29)", "rgb(111, 217, 67)"]
    const [developerSelect, setDeveloperSelect] = useState("");

    const dispatch = useDispatch()
    const { dialogue, dialogueData, dialogueType } = useSelector((state) => state.dialogue);
    const { developerAdminData } = useSelector((state) => state.ticketAdmin);



    const [error, setError] = useState({
        developerSelect: ""
    });


    useEffect(() => {
        setDeveloperSelect(dialogueData?.developer)
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
        if (!developerSelect
        ) {
            let error = {};
            if (!developerSelect) error.developerSelect = "Developer is Required"
            return setError({ ...error })
        } else {

            const getData = {
                ticket: dialogueData?._id,
                developer: developerSelect?._id,
            }
            let payload = {
                data: getData,
            }
            let response = await dispatch(updateTicketDeveloper(payload)).unwrap();
            if (response?.data?.status) {
                dispatch(closeDialog({ type: "editTicket" }))
            } else {
                dispatch(closeDialog({ type: "editTicket" }))
            }
        }
    };

    return (
        <div className='dialog DeveloperDialog TicketDialog'>
            <div className='mainDiaogBox'>
                <div className='dialogHead'>
                    <h6>Developer Change</h6>
                    <IoCloseSharp onClick={() => dispatch(closeDialog({ type: "ticket" }))} />
                </div>
                <div className='dialogBody' style={{ minHeight: "250px" }}>
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
