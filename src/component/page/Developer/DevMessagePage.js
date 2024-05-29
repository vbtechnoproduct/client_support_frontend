import React, { useEffect, useRef, useState } from 'react'
import Title from '../../extras/Title'
import $ from "jquery";
import { IoIosSend } from "react-icons/io";
import AvtarImg from '../../../assets/images/AvtarImg.png'
import chatBg from '../../../assets/images/chatBg.jpg'
import { LuPaperclip } from "react-icons/lu";
import { getMessageDataDev, getMessageOldChatDev } from '../../redux/devSlice/devMessageSlice'
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { io } from 'socket.io-client';
import { baseURL } from '../../utils/config';

export default function DevMessagePage() {
    const { messageDev, messageDevOldChat } = useSelector((state) => state.devMessage);

    const dispatch = useDispatch()
    const [start, setStart] = useState(1)
    const [limit, setLimit] = useState(10)
    const [userDetailShow, setUserDetailShow] = useState()
    const [sendMessage, setSendMessage] = useState("")
    const [allChatData, setAllChatData] = useState([])

    const [data, setData] = useState([])
    const socketRef = useRef()

    const getDeveloper = JSON.parse(sessionStorage.getItem("dev"))

    useEffect(() => {
        if (getDeveloper) {
            const socket = io.connect(baseURL, {
                transports: ["websocket", "polling", "flashsocket"],
                query: { globalRoom: getDeveloper?._id },
            });
            socketRef.current = socket;
            socketRef.current.on("connect", () => {
            });
            return () => {
                socketRef.current.disconnect();
            };
        }
    }, []);

    useEffect(() => {
        setData(messageDev)
        setUserDetailShow(messageDev ? messageDev[0] : "")
    }, [messageDev])

    useEffect(() => {
        socketRef.current &&
            socketRef.current.on("message", (messageShow) => {
            });

    }, [socketRef.current])

    useEffect(() => {
        const payload = {
            start: start,
            limit: limit
        }
        dispatch(getMessageDataDev(payload))
    }, [])

    $(document).ready(function () {
        $("img").bind("error", function () {
            // Set the default image
            $(this).attr("src", AvtarImg);
        });
    });
    useEffect(() => {
        if (userDetailShow) {
            const payload = {
                id: userDetailShow?._id
            }
            dispatch(getMessageOldChatDev(payload))
        }
    }, [userDetailShow])

    useEffect(() => {
        setAllChatData(messageDevOldChat)
    }, [messageDevOldChat])


    const handleOnChat = (data) => {
        setUserDetailShow(data)
    }
    const handleSendMessage = () => {
        const chatData = {
            chatTopicId: userDetailShow?._id,
            senderRole: "admin",
            sender: userDetailShow?.receiver?._id
        };
        socketRef &&
            socketRef?.emit("message", {
                chatData
            });
    }

    return (
        <div className='messagePage devChatPage'>
            <div className='messageConetnt'>
                <div className='row'>
                    <div className='col-2 '>
                        {/* <div className='chatUserShow'>
                            {
                                data?.map((item) => {
                                    return (
                                        <div className={`userProfileBox ${item?._id === userDetailShow?._id ? "activeChat" : ""}`} onClick={() => handleOnChat(item)} >
                                            <img src={item?.receiver?.image} />
                                            <div className='profileText'>
                                                <h6>{item?.receiver?.name}</h6>
                                                <h5>{item?.chat?.message}</h5>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div> */}
                    </div>
                    <div className='col-8'>
                        <div className='chatDataShow'>
                            <div className='topchatHead'>
                                <div className='chatImgShow'>
                                    <img src={userDetailShow?.receiver?.image} />
                                </div>
                                <h6>{userDetailShow?.receiver?.name}</h6>
                            </div>
                            <div className='chatDataBody'>
                                {/* <div className='bgChat'></div> */}
                                <img src={chatBg} className='chatBg' />
                                <div className='allChatShow'>
                                    {
                                        allChatData?.map((item) => {
                                            return (
                                                <>
                                                    <div className='leftChat'>
                                                        <div className='chatDataProfile'>
                                                            <img src={userDetailShow?.receiver} />
                                                        </div>
                                                        <div className='messageShow'>
                                                            <div className='UserameShow'>
                                                                <h6>{userDetailShow?.receiver?.name}</h6>
                                                                <h6>{dayjs(item?.date).format("DD MMM, YYYY")}</h6>
                                                            </div>
                                                        </div>
                                                        {
                                                            item?.messageType === 2 ?

                                                                ""
                                                                :
                                                                <></>
                                                        }
                                                    </div>
                                                </>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                            <div className='chatDataFooter'>
                                <div className='chatButtonSend' onClick={() => handleSendMessage()}>
                                    <input
                                        type="text"
                                        value={sendMessage}
                                        placeholder='Enter Message Hear...'
                                        onChange={(e) => setSendMessage(e.target.value)}
                                    />
                                    <div className='socialButton'>
                                        <div className='media-icon'>
                                            <LuPaperclip />
                                        </div>
                                        <div className='sendButtonIcon'>
                                            <IoIosSend />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='col-2 '>
                    </div>
                </div>
            </div>
        </div>
    )
}
