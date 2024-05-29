import React, { useEffect, useState } from 'react'
import { IoCloseSharp } from "react-icons/io5";
import Input from '../../../extras/Input';
import { closeDialog } from '../../../redux/slice/dialogueSlice';
import Button from '../../../extras/Button';
import { IoIosCopy } from "react-icons/io";
import { createDeveloper, updateDeveloper } from '../../../redux/slice/developerSlice'
import { useDispatch, useSelector } from 'react-redux';
import { Success } from '../../../api/toastServices';
import { useNavigate } from 'react-router-dom';


export default function TicketClosedDialogue() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { dialogue, dialogueData, dialogueType } = useSelector((state) => state.dialogue);

    const handleClosedTicket = () => {
        dispatch(closeDialog({ type: "ticketClosed" }))
        navigate(-1)
    }


    return (
        <div className='dialog DeveloperDialog TicketClosedDialog'>
            <div className='mainDiaogBox'>
                {/* <div className='dialogHead'>
                    <h6>View Ticket</h6>
                    <IoCloseSharp onClick={() => dispatch(closeDialog({ type: "developer" }))} />
                </div> */}
                <div className='dialogBody'>
                    <div>
                        <h6>Ticket has been closed.</h6>
                    </div>
                </div>
                <div className='dialog-footer'>
                    <Button
                        text={"Close"}
                        className={"cancelButton"}
                        onClick={() => handleClosedTicket()}
                    />
                </div>

            </div>
        </div>
    )
}
