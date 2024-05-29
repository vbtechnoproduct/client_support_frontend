import React, { useEffect, useState } from 'react'
import { IoCloseSharp } from "react-icons/io5";
import Input from '../../../extras/Input';
import { closeDialog } from '../../../redux/slice/dialogueSlice';
import Button from '../../../extras/Button';
import { IoIosCopy } from "react-icons/io";
import { createDeveloper, updateDeveloper } from '../../../redux/slice/developerSlice'
import { useDispatch, useSelector } from 'react-redux';
import { Success } from '../../../api/toastServices';


export default function TicketView() {
    const [name, setName] = useState("");
    const [image, setImage] = useState([]);
    const [imagePath, setImagePath] = useState("");
    const dispatch = useDispatch()
    const { dialogue, dialogueData, dialogueType } = useSelector((state) => state.dialogue);


    const [error, setError] = useState({
        name: "",
        image: "",
    });

    useEffect(() => {
        setImagePath("")
        setImage("")
        setName("")
    }, [dialogue])

    useEffect(() => {
        setName(dialogueData?.name)
        setImagePath(dialogueData?.image)
    }, [dialogueData])


    const handleImage = (e) => {
        if (!e.target.files) {
            setError((prevErrors) => ({
                ...prevErrors,
                image: "Image is Required",
            }));
        }
        setImage(e.target.files[0]);
        setImagePath(URL.createObjectURL(e.target.files[0]));
        setError((prevErrors) => ({
            ...prevErrors,
            image: "",
        }));
    };

    const hadnleCopyText = (ticketId) => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(ticketId)
                .then(() => {
                    Success("Ticket copied")
                })
                .catch((error) => {
                    console.error('Unable to copy ticket ID: ', error);
                });
        } else {
            // Fallback method for browsers that don't support Clipboard API
            const textArea = document.createElement('textarea');
            textArea.value = ticketId;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            Success("Ticket copied")

        }
    }

    return (
        <div className='dialog DeveloperDialog'>
            <div className='mainDiaogBox'>
                <div className='dialogHead'>
                    <h6>View Ticket</h6>
                    <IoCloseSharp onClick={() => dispatch(closeDialog({ type: "developer" }))} />
                </div>
                <div className='dialogBody'>
                    <div className='mb-3'>
                        <div className='ticketBoxInput'>
                            <label>Client Ticket</label>
                            <div className='ticketInputShow'>
                                <span>{dialogueData?.clientChatLink}</span>
                                <div className='copyText'>
                                    <Button
                                        onClick={() => hadnleCopyText(dialogueData?.clientChatLink)}
                                        bIcon={<IoIosCopy />}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className='ticketBoxInput mt-3'>
                            <label>Developer Ticket</label>
                            <div className='ticketInputShow'>
                                <span>{dialogueData?.developerChatLink}</span>
                                <div className='copyText'>
                                    <Button
                                        onClick={() => hadnleCopyText(dialogueData?.developerChatLink)}
                                        bIcon={<IoIosCopy />}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='dialog-footer'>
                    <Button
                        text={"Close"}
                        className={"cancelButton"}
                        onClick={() => dispatch(closeDialog({ type: "developer" }))}
                    />
                </div>

            </div>
        </div>
    )
}
