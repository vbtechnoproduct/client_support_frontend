import React, { useEffect, useRef, useState } from "react";
import Title from "../../extras/Title";
import $ from "jquery";
import AvtarImg from "../../../assets/images/AvtarImg.png";
import NoImg from "../../../assets/images/noImg.png";
import chatBg from "../../../assets/images/chatBg.jpg";
import { LuPaperclip } from "react-icons/lu";
import {
  getMessageOldChatClient,
  sendChatImage,
  closeTicketDeveloper,
  setMessageLoader,
} from "../../redux/clientDevSlice/messageClientSlice";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import { baseURL } from "../../utils/config";
import { IoIosCloseCircle } from "react-icons/io";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { getAdmin } from "../../redux/slice/authSlice";
import { AiFillCloseCircle } from "react-icons/ai";
import { BsFileEarmarkZipFill } from "react-icons/bs";
import AdminImg from "../../../assets/images/AvtarImg.png";
import InfiniteScroll from "react-infinite-scroll-component";

import notificationSound from "../../../assets/notificationSound.mp3";
import Button from "../../extras/Button";
import { MdOutlineClose } from "react-icons/md";
import { MdOutlineFileDownload } from "react-icons/md";
import { io } from "socket.io-client";
import { IoMdSend } from "react-icons/io";
import { BsEmojiSmile } from "react-icons/bs";
import {
  updateDeveloperClient,
  updateClient,
} from "../../redux/clientDevSlice/messageClientSlice";
import { NavLink, useLocation, useParams } from "react-router-dom";
import { LuReply } from "react-icons/lu";
import { DangerRight } from "../../api/toastServices";
import relativeTime from "dayjs/plugin/relativeTime";
import Picker from "emoji-picker-react";
import { BsThreeDotsVertical } from "react-icons/bs";
import axios from "axios";
import { apiInstance } from "../../api/axiosApi";
import { Mention, MentionsInput } from "react-mentions";
import EmojiPicker from "emoji-picker-react";
import TicketClosedDialogue from "../Admin/dialogue/TicketClosedDialogue";
import { openDialog } from "../../redux/slice/dialogueSlice";
import { onMessageListener, requestForToken } from "../../api/FirebaseConfig";
import NotificationComponent, {
  tostMessage,
} from "../../extras/NotificationCom";
import ImageViewDialogue from "../Admin/dialogue/ImageViewDialogue";

dayjs.extend(relativeTime);
dayjs.extend(utc); // Extend dayjs with utc plugin
dayjs.extend(timezone);
export default function MessageOnePage() {
  const bgProfileColor = [
    "rgb(255, 58, 110)",
    "rgb(255, 58, 110)",
    "rgb(108, 117, 125",
    "rgb(255, 162, 29)",
    "rgb(111, 217, 67)",
  ];
  const replayBorderColor = [
    "#007bfc",
    "#007bfc",
    "#53bdeb",
    "#a5b337",
    "#53bdeb",
    "#06cf9c",
  ];
  const randomIndex = Math.floor(Math.random() * replayBorderColor?.length);
  const getFcmToken = JSON.parse(sessionStorage.getItem("FCMToken"));
  const { messageClient, messageClientOldChat, totalClientOldChat } =
    useSelector((state) => state.clientMessage);
  const { dialogue, dialogueData, dialogueType } = useSelector(
    (state) => state.dialogue
  );
  const dispatch = useDispatch();
  const location = useLocation();
  const [start, setStart] = useState(1);
  const [limit, setLimit] = useState(20);

  const [ticketData, setTicketData] = useState("");
  const [sendMessage, setSendMessage] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [allChatData, setAllChatData] = useState([]);
  const [senderDetails, setSenderDetails] = useState("");
  const [showReplay, setShowReplay] = useState(null);
  const [receiverDetails, setReceiverDetails] = useState("");
  const [messageRole, setMessageRole] = useState("");
  const [emojiShow, setEmojiShow] = useState(false);
  const [chatTopicData, setChatTopicData] = useState("");
  const [notificationData, setNotificationData] = useState(null);
  const [mentionsData, setMentionsData] = useState([]);
  const [image, setImage] = useState(null);
  const [imagePath, setImagePath] = useState("");
  const [tokenSet, setTokenSet] = useState(true);
  const [chatData, setChatData] = useState([]);
  const [receiverImg, setReceiverImg] = useState("");
  const chatContainerRef = useRef(null);
  const socketRef = useRef(null);
  let { id, otherId } = useParams();
  const safeObjectValues = (obj) => obj && Object.values(obj);

  const onEmojiClick = (event, emojiObject) => {
    if (emojiObject && emojiObject.emoji) {
      setSendMessage(sendMessage + emojiObject.emoji);
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatData]);

  useEffect(() => {
    const loaderShow = {
      loader: true,
    };
    dispatch(setMessageLoader(loaderShow));
    if (id) {
      const socket = io.connect(baseURL, {
        transports: ["websocket", "polling", "flashsocket"],
        query: { globalRoom: id, uniqueId: otherId },
      });
      socketRef.current = socket;
      socketRef.current.on("connect", () => {
        console.log("Socket connected");
        socketRef.current.emit("ticket", id);
        const loaderShow = {
          loader: false,
        };
        dispatch(setMessageLoader(loaderShow));
      });
      socketRef.current.on("disconnect", () => {
        console.log("Socket disconnected");
      });
      socketRef.current.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
        DangerRight(error);
      });
      socketRef.current.on("ticket", (data) => {
        setTicketData(data?.ticket);
        setChatTopicData(data?.chatTopic);
      });

      return () => {
        socketRef.current.disconnect();
      };
    }
  }, [id]);

  useEffect(() => {
    socketRef.current &&
      socketRef.current.on("message", (messageShow) => {
        // if (messageShow?.messageType === 2) {
        //     // setAllChatData((prevState) => [...prevState, messageShow]);
        //     setAllChatData((prevState) => {
        //         if (Array.isArray(prevState)) {
        //             return [...prevState, messageShow];
        //         } else {
        //             return [messageShow];
        //         }
        //     });
        // }
        playRingtone();
        if (
          messageShow?.chat?.messageType === 1 &&
          messageShow?.chat?.chatTopic === chatTopicData?._id
        ) {
          setAllChatData((prevState) => {
            if (Array.isArray(prevState)) {
              return [...prevState, messageShow?.chat];
            } else {
              return [messageShow?.chat];
            }
          });
        }
        // if (messageShow?.messageType === 3) {
        //     setAllChatData((prevState) => {
        //         if (Array.isArray(prevState)) {
        //             return [...prevState, messageShow];
        //         } else {
        //             return [messageShow];
        //         }
        //     });
        // }

        if (
          (messageShow?.messageType === 2 || messageShow?.messageType === 2) &&
          senderDetails?._id !== messageShow?.sender &&
          messageShow?.chatTopic === chatTopicData?._id
        ) {
          setAllChatData((prevState) => {
            if (Array.isArray(prevState)) {
              return [...prevState, messageShow];
            } else {
              return [messageShow];
            }
          });
        }
        // if (messageShow?.mentionedHandle?.length > 0 ? messageShow?.mentionedHandle[0] === receiverDetails?._id : true) {
        //     if (senderDetails) {
        //         if (messageShow?.sender?.toString() !== senderDetails?._id?.toString()) {
        //             // setAllChatData((prevState) => [...prevState, messageShow]);
        //             setAllChatData((prevState) => {
        //                 if (Array.isArray(prevState)) {
        //                     return [...prevState, messageShow];
        //                 } else {
        //                     return [messageShow];
        //                 }
        //             });
        //         }
        //     }
        // }
      });
  }, [socketRef.current, senderDetails, chatTopicData]);

  $(document).ready(function () {
    $("#img").bind("error", function () {
      // Set the default image
      $(this).attr("src", AvtarImg);
    });
  });
  $(document).ready(function () {
    $("#chatImg").bind("error", function () {
      // Set the default image
      $(this).attr("src", NoImg);
    });
  });

  useEffect(() => {
    requestForToken();
  }, []);

  useEffect(() => {
    let receiver;
    let sender;
    let role;
    let colorCode;
    if (ticketData?.clientChatLink?.includes(otherId)) {
      sender = ticketData?.client;
      receiver = ticketData.developer;
      role = "client";
      colorCode = ticketData?.client?.colorCode;
    } else {
      sender = ticketData?.developer;
      receiver = ticketData.client;
      colorCode = ticketData?.client?.colorCode;
      role = "developer";
    }
    setReceiverDetails(receiver);
    setSenderDetails(sender);
    setMessageRole(role);
    setReceiverImg(colorCode);
  }, [ticketData, otherId]);

  useEffect(() => {
    if (getFcmToken) {
      if (ticketData?.clientChatLink?.includes(otherId)) {
        if (tokenSet) {
          const data = {
            fcmToken: getFcmToken,
            ClientId: ticketData?.client?._id,
          };
          const payload = {
            data: data,
          };
          let response = dispatch(updateClient(payload)).unwrap();
          if (response) {
            setTokenSet(false);
          }
        }
      } else {
        if (tokenSet) {
          const formData = new FormData();
          formData.append("fcmToken", getFcmToken);

          if (ticketData?.developer?._id) {
            const payload = {
              id: ticketData?.developer?._id,
              data: formData,
            };
            let response = dispatch(updateDeveloperClient(payload)).unwrap();
            if (response) {
              setTokenSet(false);
            }
          }
        }
      }
    }
  }, [ticketData, messageRole, getFcmToken]);

  useEffect(() => {
    if (chatTopicData && receiverDetails) {
      const payload = {
        id: chatTopicData?._id,
        receiver: receiverDetails?._id,
        start: start,
        limit: limit,
        loader: true,
      };
      dispatch(getMessageOldChatClient(payload));
    }
  }, [chatTopicData, receiverDetails]);

  useEffect(() => {
    setAllChatData(messageClientOldChat);
  }, [messageClientOldChat]);

  function getRandomColor(colors) {
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  }
  const generateRandomId = () => {
    const timestamp = new Date().getTime().toString(16); // Convert current timestamp to hex string
    const randomStr = Math.random().toString(16).substring(2); // Generate a random hex string
    return timestamp + randomStr;
  };

  const fetch = () => {
    setTimeout(() => {
      if (hasMore) {
        const payload = {
          id: chatTopicData?._id,
          receiver: receiverDetails?._id,
          start: start,
          limit: limit + 20,
          loader: false,
        };
        dispatch(getMessageOldChatClient(payload));
        setStart(start);
        setLimit(limit + 20);
        if (limit + 20 >= totalClientOldChat) {
          setHasMore(false);
        }
      }
    }, 5000);
  };

  const handleSendMessage = () => {
    $(".messages__listData").animate({ scrollTop: $(document).height() }, 1000);
    const scrollableDiv = document.getElementById("scrollableDiv");
    scrollableDiv.scrollTop = scrollableDiv.scrollHeight;
    setEmojiShow(false);
    const formettMessage = sendMessage;
    const mentionDisplayNames = mentionsData?.map(
      (mention) => mention?.display
    );

    const newText = sendMessage?.replace(/\@\[(.*?)\]\(.*?\)/g, (match, p1) => {
      if (mentionDisplayNames?.includes(p1)) {
        return `@${p1}`;
      }
      return match;
    });

    const regex = /@\[(.*?)\]\((.*?)\)/g;
    let match;
    const ids = [];

    while ((match = regex?.exec(sendMessage)) !== null) {
      ids.push(match[2]);
    }

    if (newText?.length > 0) {
      const chatData = {
        chatTopicId: chatTopicData?._id,
        senderRole: messageRole,
        sender: senderDetails?._id,
        isReply: showReplay ? true : false,
        replyMessageId: showReplay ? showReplay?._id : null,
        message: newText,
        mention: ids,
      };
      // setAllChatData((prevState) => [...prevState, chatData]);
      socketRef.current &&
        socketRef.current?.emit("message", {
          chatData,
        });

      setSendMessage("");

      const dateObject = new Date();
      const dateString = dateObject.toISOString();

      const chatDataSet = {
        messageType: 1,
        chatTopic: chatTopicData?._id,
        role: messageRole,
        sender: senderDetails?._id,
        message: newText,
        _id: generateRandomId(),
        date: new Date().toLocaleString(),
        offlineMessage: true,
        createdAt: dateString,
      };
      // setAllChatData((prevState) => [...prevState, chatDataSet]);
      // setAllChatData((prevState) => {
      //     if (Array.isArray(prevState)) {
      //         return [...prevState, chatDataSet];
      //     } else {
      //         return [chatDataSet];
      //     }
      // });
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleKeyPressInput = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault(); // Prevent the default behavior (e.g., newline in textarea)
      handleSendMessage(); // Call your function to send the message
    }
  };

  const handleUpload = (e) => {
    if (e.target.files[0].type === "application/x-zip-compressed") {
      const dateObject = new Date();
      const dateString = dateObject?.toISOString();

      const chatDataSet = {
        messageType: 3,
        chatTopic: chatTopicData?._id,
        role: messageRole === "client" ? "client" : "developer",
        sender: senderDetails?._id,
        message: "📦 Zip",
        name: e.target.files[0]?.name,
        image: URL.createObjectURL(e.target.files[0]),
        _id: generateRandomId(),
        date: new Date().toLocaleString(),
        offlineMessage: true,
        createdAt: dateString,
      };

      setAllChatData((prevState) => [...prevState, chatDataSet]);
      $(".messages__listData").animate(
        { scrollTop: $(document).height() },
        1000
      );
      const formData = new FormData();
      formData.append("senderId", senderDetails?._id && senderDetails?._id);
      formData.append(
        "receiverId",
        receiverDetails?._id && receiverDetails?._id
      );
      formData.append("messageType", 3);
      formData.append(
        "receiverRole",
        messageRole === "client" ? "developer" : "client"
      );
      formData.append(
        "senderRole",
        messageRole === "client" ? "client" : "developer"
      );
      formData.append("image", e.target.files[0]);
      const payload = {
        data: formData,
      };
      dispatch(sendChatImage(payload));
    } else {
      const dateObject = new Date();
      const dateString = dateObject?.toISOString();

      const chatDataSet = {
        messageType: 2,
        chatTopic: chatTopicData?._id,
        role: "admin",
        sender: senderDetails?._id,
        image: "📸 Image",
        image: URL.createObjectURL(e.target.files[0]),
        _id: generateRandomId(),
        date: new Date().toLocaleString(),
        offlineMessage: true,
        createdAt: dateString,
      };

      setAllChatData((prevState) => [...prevState, chatDataSet]);
      const formData = new FormData();
      formData.append("senderId", senderDetails?._id && senderDetails?._id);
      formData.append("messageType", 2);
      formData.append(
        "receiverId",
        receiverDetails?._id && receiverDetails?._id
      );
      formData.append(
        "receiverRole",
        messageRole === "client" ? "developer" : "client"
      );
      formData.append(
        "senderRole",
        messageRole === "client" ? "client" : "developer"
      );
      formData.append("image", e.target.files[0]);
      const payload = {
        data: formData,
      };
      dispatch(sendChatImage(payload));
      setImage(null);
      $(".messages__listData").animate(
        { scrollTop: $(document).height() },
        1000
      );
    }
  };

  const handleScrollViewMessage = (item) => {
    if (item?.isReply === true && item.replyMessageId?._id) {
      const element = document.getElementById(item.replyMessageId._id);
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "nearest",
        });
        element.classList.add("replayScroll");
        setTimeout(() => {
          element.classList.remove("replayScroll");
        }, 2000);
      } else {
        console.warn(`Element with ID ${item.replyMessageId._id} not found.`);
      }
    } else {
      console.warn("Invalid item or replyMessageId.");
    }
  };
  useEffect(() => {
    const uniqueObject = {};
    const uniqueData = allChatData?.filter((item) => {
      if (!uniqueObject[item?._id]) {
        uniqueObject[item?._id] = true;
        return true;
      }
      return false;
    });
    const sortedData = uniqueData?.sort(
      (a, b) => new Date(a?.date) - new Date(b?.date)
    );
    setChatData(sortedData);
    $(".messages__listData").animate({ scrollTop: $(document).height() }, 1000);
  }, [allChatData]);

  useEffect(() => {
    $(".messages__listData").animate({ scrollTop: $(document).height() }, 1000);
  }, []);

  const hadnleTicketClose = async () => {
    const checkId = ticketData?.developerChatLink?.includes(otherId);
    if (checkId) {
      const payload = {
        id: ticketData?._id,
        developerId: ticketData?.developer?._id,
      };
      let response = await dispatch(closeTicketDeveloper(payload)).unwrap();
      if (response?.data?.status) {
        dispatch(openDialog({ type: "ticketClosed", data: response?.data }));
      }
    }
  };

  const hadnleReplayModelOpen = (item) => {
    setShowReplay(null);
    setShowReplay(item);
  };

  useEffect(() => {
    if (messageRole === "client" && ticketData?.status === 2) {
      dispatch(openDialog({ type: "ticketClosed", data: " response?.data" }));
    }
  }, [messageRole, ticketData]);

  function formatChatDate(createdAt) {
    const currentDate = dayjs();
    const messageDate = dayjs(createdAt);
    let formattedDate = "";

    if (currentDate.isSame(messageDate, "day")) {
      formattedDate = messageDate.format("h:mm A"); // Today's message, show time
    } else if (currentDate.diff(messageDate, "day") === 1) {
      formattedDate = "Yesterday"; // Yesterday's message
    } else {
      formattedDate = messageDate.format("DD/MM/YYYY h:mma"); // Older dates
    }

    return formattedDate;
  }

  const ImageLoad = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
      setImagePath(URL.createObjectURL(e.target.files[0]));
    }
  };

  useEffect(() => {
    if (safeObjectValues(receiverDetails)?.length > 0) {
      const data = [
        {
          id: receiverDetails?._id,
          display: receiverDetails?.name,
          image: receiverDetails?.image,
        },
        {
          id: senderDetails?._id,
          image: senderDetails?.image,
          display: senderDetails?.name,
        },
      ];
      setMentionsData(data);
    }
  }, [receiverDetails, senderDetails]);

  const handleOnChange = (e) => {
    setSendMessage(e.target.value);
  };

  const hadnleEMojiShow = () => {
    setEmojiShow(!emojiShow);
  };

  const hadnleAddData = (data, display) => {
    // Return the JSX you want to render here
    return <div>{display}</div>;
  };

  useEffect(() => {
    const mediaQueryList = window.matchMedia("(max-width: 600px)");

    // Check if the media query matches
    if (mediaQueryList.matches) {
      $("#responsiveViewDetails").addClass("mobileDetailsChat");
    }

    // Add a listener for changes to the media query
    const listener = (event) => {
      if (event.matches) {
        $("#responsiveViewDetails").addClass("mobileDetailsChat");
        $("#appInfoBgResponsive").css("display", "block");
      } else {
        $("#responsiveViewDetails").removeClass("mobileDetailsChat");
        $("#appInfoBgResponsive").css("display", "none");
      }
    };
    mediaQueryList.addListener(listener);

    // Cleanup the listener when the component unmounts
    return () => {
      mediaQueryList.removeListener(listener);
    };
  }, []);

  const playRingtone = async () => {
    const audio = await new Audio(notificationSound);
    audio.play();
  };

  const zipNameShow = (url) => {
    const segments = url?.split(/[\\/]/);
    const filename = segments[segments.length - 1];
    return filename;
  };

  const handleZipDownload = (fileUrl, name) => {
    window.location.href = fileUrl;
  };

  useEffect(() => {
    if (!("Notification" in window)) {
      console.log("This browser does not support desktop notification");
    } else {
      if (Notification.permission !== "granted") {
        Notification.requestPermission().then((permission) => {
          if (permission !== "granted") {
            console.log("User denied the notification permission");
          }
        });
      }
    }
  }, []);

  onMessageListener()
    .then((payload) => {
      if (payload) {
        playRingtone();
        showNotificationToast(
          payload?.notification?.image,
          payload?.notification?.title,
          payload?.notification?.body,
          payload?.data?.["gcm.notification.colorCode"]
        );
        if (Notification.permission === "granted") {
          const getPathName = location?.pathname;
          const notificationUrl = baseURL + getPathName?.slice(1);
          navigator.serviceWorker.ready.then(function (registration) {
            registration
              .showNotification(payload?.notification?.title, {
                body: payload?.notification?.body,
                icon: payload?.notification?.image,
              })
              .then(function (notification) {
                notification.addEventListener("click", function () {
                  window.open(notificationUrl, "_blank");
                  notification.close();
                });
                setTimeout(notification.close.bind(notification), 5000);
              })
              .catch(function (err) {
                console.error("Notification failed:", err);
              });
          });
        }
      }
    })
    .catch((err) => console.log("failed: ", err));

  const showNotificationToast = (imgShow, title, body, colorCode) => {
    setNotificationData({ imgShow, colorCode, title, body, colorCode });
    tostMessage(imgShow, title, body, colorCode);
  };

  const hadnleShowDetailModel = () => {
    $(".appInfo").each(function () {
      const currentDisplay = $(this).css("display");
      const newDisplay = currentDisplay === "none" ? "block" : "none";
      $(this).css("display", newDisplay);
    });

    $("#appInfoBgResponsive").each(function () {
      const currentDisplay = $(this).css("display");
      const newDisplay = currentDisplay === "block" ? "none" : "block";
      $(this).css("display", newDisplay);
    });
  };

  const hadnleDetailsClose = () => {
    $(".appInfo").css("display", "none");
    $("#appInfoBgResponsive").css("display", "none");
  };

  return (
    <>
      <div className="messagePage mesageOnPage">
        <div className="messageConetnt">
          <div className="row">
            <div className="col-12 col-sm-8 col-md-8 col-lg-9 p-sm-0">
              <div className="chatDataShow">
                <div className="topchatHead">
                  <div className="chatImgShow">
                    <div className="chatBodyGrupeImg">
                      {safeObjectValues(receiverDetails)?.length > 0 &&
                      receiverDetails?.image ? (
                        <img
                          src={
                            receiverDetails?.image ? receiverDetails?.image : ""
                          }
                          id="img"
                        />
                      ) : (
                        <span
                          className="nameImgProfile"
                          style={{ backgroundColor: `${receiverImg}` }}
                        >
                          {receiverDetails?.name
                            ? receiverDetails?.name?.charAt(0)
                            : ""}
                        </span>
                      )}
                      {/* <h6> {safeObjectValues(receiverDetails)?.length > 0 && receiverDetails?.name}<span>{`(${messageRole})`}</span></h6> */}
                      <div className="textHead">
                        <h6>
                          {" "}
                          {safeObjectValues(receiverDetails)?.length > 0 &&
                          receiverDetails?.name
                            ? receiverDetails?.name
                            : ""}
                        </h6>
                        <div className="statusShow">
                          {receiverDetails && (
                            <>
                              <div
                                className={`${
                                  receiverDetails?.isOnline
                                    ? "onlineButton"
                                    : "offlineButton"
                                }`}
                              ></div>
                              <h5>
                                {receiverDetails
                                  ? receiverDetails?.isOnline
                                    ? "Online"
                                    : "Offline"
                                  : ""}
                              </h5>
                            </>
                          )}
                        </div>
                      </div>

                      {/* {
                                            safeObjectValues(senderDetails)?.length > 0 && senderDetails?.image ?
                                                <img src={senderDetails?.image ? senderDetails?.image : ""} id="img" />
                                                : <span className='nameImgProfile' style={{ backgroundColor: `${receiverImg}` }}>{senderDetails?.name ? senderDetails?.name?.charAt(0) : ""}</span>
                                        } */}
                    </div>
                  </div>
                  <div className="openDetailModel" style={{ display: "none" }}>
                    <Button
                      bIcon={<BsThreeDotsVertical />}
                      type={"button"}
                      onClick={hadnleShowDetailModel}
                      className={"menuIcon"}
                    />
                  </div>
                </div>
                <div className="chatDataBody " id="messages__listData">
                  <div
                    className="allChatShow"
                    id="scrollableDiv"
                    ref={chatContainerRef}
                  >
                    <InfiniteScroll
                      dataLength={chatData?.length}
                      next={fetch}
                      loader={
                        chatData?.length > 0 ? (
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              marginBottom: "15px",
                            }}
                          >
                            <div class="chat-loader"></div>
                          </div>
                        ) : (
                          ""
                        )
                      }
                      endMessage={
                        <p
                          style={{
                            color: "white",
                            textAlign: "center",
                            backgroundColor: "#32999396",
                            padding: "6px",
                          }}
                        >
                          No more messages
                        </p>
                      }
                      style={{
                        display: "flex",
                        flexDirection: "column-reverse",
                        overflow: "hidden",
                        marginBlock: "12px",
                      }}
                      inverse={true}
                      hasMore={hasMore}
                      scrollableTarget="scrollableDiv"
                    >
                      {safeObjectValues(receiverDetails)?.length > 0 &&
                        safeObjectValues(senderDetails)?.length > 0 &&
                        chatData
                          ?.slice(0)
                          ?.reverse()
                          ?.map((item) => {
                            return (
                              <>
                                {item?.sender === senderDetails?._id ? (
                                  <div className="rightContent" id={item?._id}>
                                    {item?.messageType === 1 ? (
                                      <div
                                        className="rightChat "
                                        ref={chatContainerRef}
                                      >
                                        <div className="chatDataProfile">
                                          {senderDetails &&
                                          senderDetails?.image ? (
                                            <img
                                              src={senderDetails?.image}
                                              id="img"
                                              className="profileImg"
                                            />
                                          ) : (
                                            <span
                                              className="nameImgProfile"
                                              style={{
                                                backgroundColor: `${receiverImg}`,
                                              }}
                                            >
                                              {senderDetails?.name
                                                ? senderDetails?.name?.charAt(0)
                                                : ""}
                                            </span>
                                          )}
                                        </div>
                                        <div className="messageShow">
                                          <div
                                            className={`messageBodyShow ${
                                              item?.message.includes("@client")
                                                ? "mentionStyle"
                                                : ""
                                            } ${
                                              item?.isReply === true
                                                ? "replayMessageBody"
                                                : ""
                                            }`}
                                          >
                                            {/* <p>{item?.message}</p> */}
                                            <button
                                              className="downarrowMessage downarrowMessageRight"
                                              onClick={() =>
                                                hadnleReplayModelOpen(item)
                                              }
                                            >
                                              <LuReply />
                                            </button>
                                            {item?.isReply === true ? (
                                              <div className="replayMessageText">
                                                <h6
                                                  style={{
                                                    borderColor: `${replayBorderColor[randomIndex]}`,
                                                  }}
                                                  onClick={() =>
                                                    handleScrollViewMessage(
                                                      item
                                                    )
                                                  }
                                                >
                                                  {
                                                    item?.replyMessageId
                                                      ?.message
                                                  }
                                                </h6>
                                                {item?.message
                                                  .split(
                                                    new RegExp(
                                                      `(@${senderDetails?.name}|@${receiverDetails?.name})`
                                                    )
                                                  )
                                                  .map((part, index) =>
                                                    part.startsWith("@") &&
                                                    part !==
                                                      `@${senderDetails?.name}` &&
                                                    part !==
                                                      `@${receiverDetails?.name}` ? (
                                                      <span
                                                        key={index}
                                                        className="mentionName"
                                                      >
                                                        {part}
                                                      </span>
                                                    ) : part ===
                                                        `@${senderDetails?.name}` ||
                                                      part ===
                                                        `@${receiverDetails?.name}` ? (
                                                      <span
                                                        key={index}
                                                        className="mentionName"
                                                      >
                                                        {part}
                                                      </span>
                                                    ) : (
                                                      <span key={index}>
                                                        {part}
                                                      </span>
                                                    )
                                                  )}
                                              </div>
                                            ) : (
                                              item?.message
                                                .split(
                                                  new RegExp(
                                                    `(@${senderDetails?.name}|@${receiverDetails?.name})`
                                                  )
                                                )
                                                .map((part, index) =>
                                                  part.startsWith("@") &&
                                                  part !==
                                                    `@${senderDetails?.name}` &&
                                                  part !==
                                                    `@${receiverDetails?.name}` ? (
                                                    <span
                                                      key={index}
                                                      className="mentionName"
                                                    >
                                                      {part}
                                                    </span>
                                                  ) : part ===
                                                      `@${senderDetails?.name}` ||
                                                    part ===
                                                      `@${receiverDetails?.name}` ? (
                                                    <span
                                                      key={index}
                                                      className="mentionName"
                                                    >
                                                      {part}
                                                    </span>
                                                  ) : (
                                                    <span key={index}>
                                                      {part}
                                                    </span>
                                                  )
                                                )
                                            )}
                                          </div>
                                          <div className="UserameShow">
                                            <h6>
                                              {formatChatDate(item?.createdAt)}
                                            </h6>
                                          </div>
                                        </div>
                                      </div>
                                    ) : item?.messageType === 2 ? (
                                      <div
                                        className="rightChat messageShowImg"
                                        id="messages__listData"
                                        ref={chatContainerRef}
                                      >
                                        <div className="messageShow">
                                          <div className="messageBodyShow">
                                            {/* <NavLink target={'_blank'} to={item?.image} style={{ cursor: "pointer" }}> */}
                                            <img
                                              src={
                                                item?.image
                                                  ? item?.image
                                                  : NoImg
                                              }
                                              id="chatImg"
                                              onClick={() =>
                                                dispatch(
                                                  openDialog({
                                                    type: "imageView",
                                                    data: item?.image,
                                                  })
                                                )
                                              }
                                            />
                                            {/* </NavLink> */}
                                            <div className="UserameShow">
                                              <h6>
                                                {formatChatDate(
                                                  item?.createdAt
                                                )}
                                              </h6>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="chatDataProfile">
                                          {senderDetails &&
                                          senderDetails?.image ? (
                                            <img
                                              src={senderDetails?.image}
                                              id="img"
                                              className="profileImg"
                                            />
                                          ) : (
                                            <span
                                              className="nameImgProfile"
                                              style={{
                                                backgroundColor: `${receiverImg}`,
                                              }}
                                            >
                                              {senderDetails?.name
                                                ? senderDetails?.name?.charAt(0)
                                                : ""}
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    ) : (
                                      <div
                                        className="rightChat messageShowImg"
                                        id="messages__listData"
                                        ref={chatContainerRef}
                                      >
                                        <div className="messageShow">
                                          <div className="messageBodyShow">
                                            <div className="zipfileShow">
                                              <BsFileEarmarkZipFill />
                                              <h6>
                                                {zipNameShow(item?.image)}
                                              </h6>
                                              <Button
                                                className={"closeModel"}
                                                onClick={() =>
                                                  handleZipDownload(
                                                    item?.image,
                                                    zipNameShow(item?.image)
                                                  )
                                                }
                                                bIcon={
                                                  <MdOutlineFileDownload />
                                                }
                                              />
                                            </div>
                                          </div>
                                          <div className="UserameShow">
                                            <h6>
                                              {formatChatDate(item?.createdAt)}
                                            </h6>
                                          </div>
                                        </div>
                                        <div className="chatDataProfile">
                                          {senderDetails &&
                                          senderDetails?.image ? (
                                            <img
                                              src={senderDetails?.image}
                                              id="img"
                                              className="profileImg"
                                            />
                                          ) : (
                                            <span
                                              className="nameImgProfile"
                                              style={{
                                                backgroundColor: `${receiverImg}`,
                                              }}
                                            >
                                              {senderDetails?.name
                                                ? senderDetails?.name?.charAt(0)
                                                : ""}
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <div className="leftContent" id={item?._id}>
                                    {item?.messageType === 1 ? (
                                      <div
                                        className="leftChat"
                                        id="messages__listData"
                                      >
                                        <div className="messageShow">
                                          <div
                                            className={`messageBodyShow ${
                                              item?.isReply === true
                                                ? "replayMessageBody"
                                                : ""
                                            }`}
                                          >
                                            {/* <p>{item?.message}</p> */}
                                            <button
                                              className="downarrowMessage "
                                              onClick={() =>
                                                hadnleReplayModelOpen(item)
                                              }
                                            >
                                              <LuReply />
                                            </button>
                                            {item?.isReply === true ? (
                                              <div className="replayMessageText">
                                                <h6
                                                  style={{
                                                    borderColor: `${replayBorderColor[randomIndex]}`,
                                                  }}
                                                  onClick={() =>
                                                    handleScrollViewMessage(
                                                      item
                                                    )
                                                  }
                                                >
                                                  {
                                                    item?.replyMessageId
                                                      ?.message
                                                  }
                                                </h6>
                                                {item?.message
                                                  .split(
                                                    new RegExp(
                                                      `(@${senderDetails?.name}|@${receiverDetails?.name})`
                                                    )
                                                  )
                                                  .map((part, index) =>
                                                    part.startsWith("@") &&
                                                    part !==
                                                      `@${senderDetails?.name}` &&
                                                    part !==
                                                      `@${receiverDetails?.name}`
                                                      ? part && (
                                                          <span
                                                            key={index}
                                                            className="mentionName"
                                                          >
                                                            {part}
                                                          </span>
                                                        )
                                                      : part ===
                                                          `@${senderDetails?.name}` ||
                                                        part ===
                                                          `@${receiverDetails?.name}`
                                                      ? part && (
                                                          <span
                                                            key={index}
                                                            className="mentionName"
                                                          >
                                                            {part}
                                                          </span>
                                                        )
                                                      : part && (
                                                          <span>{part}</span>
                                                        )
                                                  )}
                                              </div>
                                            ) : (
                                              item?.message
                                                .split(
                                                  new RegExp(
                                                    `(@${senderDetails?.name}|@${receiverDetails?.name})`
                                                  )
                                                )
                                                .map((part, index) =>
                                                  part.startsWith("@") &&
                                                  part !==
                                                    `@${senderDetails?.name}` &&
                                                  part !==
                                                    `@${receiverDetails?.name}` ? (
                                                    <span
                                                      key={index}
                                                      className="mentionName"
                                                    >
                                                      {part}
                                                    </span>
                                                  ) : part ===
                                                      `@${senderDetails?.name}` ||
                                                    part ===
                                                      `@${receiverDetails?.name}` ? (
                                                    <span
                                                      key={index}
                                                      className="mentionName"
                                                    >
                                                      {part}
                                                    </span>
                                                  ) : (
                                                    <span key={index}>
                                                      {part}
                                                    </span>
                                                  )
                                                )
                                            )}
                                          </div>
                                          <div className="UserameShow">
                                            <h6>
                                              {formatChatDate(item?.createdAt) +
                                                " " +
                                                `(${item?.role
                                                  ?.charAt(0)
                                                  ?.toUpperCase()})`}
                                            </h6>
                                          </div>
                                        </div>
                                        <div className="chatDataProfile">
                                          {item?.role === "admin" ? (
                                            <img
                                              alt=""
                                              src={AdminImg}
                                              id="img"
                                              className="profileImg"
                                            />
                                          ) : receiverDetails &&
                                            receiverDetails?.image ? (
                                            <img
                                              alt=""
                                              src={receiverDetails?.image}
                                              id="img"
                                              className="profileImg"
                                            />
                                          ) : (
                                            <span
                                              className="nameImgProfile"
                                              style={{
                                                backgroundColor: `${receiverImg}`,
                                              }}
                                            >
                                              {receiverDetails?.name
                                                ? receiverDetails?.name?.charAt(
                                                    0
                                                  )
                                                : ""}
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    ) : item?.messageType === 2 ? (
                                      <div
                                        className="leftChat messageShowImg"
                                        id="messages__listData"
                                        ref={chatContainerRef}
                                      >
                                        <div className="messageShow">
                                          <div className="messageBodyShow">
                                            {/* <NavLink target={'_blank'} to={item?.image} style={{ cursor: "pointer" }} > */}
                                            <img
                                              alt=""
                                              src={
                                                item?.image
                                                  ? item?.image
                                                  : NoImg
                                              }
                                              id="chatImg"
                                              onClick={() =>
                                                dispatch(
                                                  openDialog({
                                                    type: "imageView",
                                                    data: item?.image,
                                                  })
                                                )
                                              }
                                            />
                                            {/* </NavLink> */}
                                            <div className="UserameShow">
                                              <h6>
                                                {formatChatDate(
                                                  item?.createdAt
                                                ) +
                                                  " " +
                                                  `(${item?.role
                                                    ?.charAt(0)
                                                    ?.toUpperCase()})`}
                                              </h6>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="chatDataProfile">
                                          {item?.role === "admin" ? (
                                            <img
                                              src={AdminImg}
                                              id="img"
                                              className="profileImg"
                                              alt=""
                                            />
                                          ) : senderDetails &&
                                            senderDetails?.image ? (
                                            <img
                                              src={senderDetails?.image}
                                              id="img"
                                              className="profileImg"
                                              alt=""
                                            />
                                          ) : (
                                            <span
                                              className="nameImgProfile"
                                              style={{
                                                backgroundColor: `${receiverImg}`,
                                              }}
                                            >
                                              {senderDetails?.name
                                                ? senderDetails?.name?.charAt(0)
                                                : ""}
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    ) : (
                                      <div
                                        className="leftChat messageShowImg"
                                        id="messages__listData"
                                        ref={chatContainerRef}
                                      >
                                        <div className="messageShow">
                                          <div className="messageBodyShow">
                                            <div className="zipfileShow">
                                              <BsFileEarmarkZipFill />
                                              <h6>
                                                {item?.name
                                                  ? item?.name
                                                  : zipNameShow(item?.image)}
                                              </h6>
                                              <Button
                                                className={"closeModel"}
                                                onClick={() =>
                                                  handleZipDownload(
                                                    item?.image,
                                                    zipNameShow(item?.image)
                                                  )
                                                }
                                                bIcon={
                                                  <MdOutlineFileDownload />
                                                }
                                              />
                                            </div>
                                          </div>
                                          <div className="UserameShow">
                                            <h6>
                                              {formatChatDate(item?.createdAt)}
                                            </h6>
                                          </div>
                                        </div>
                                        <div className="chatDataProfile">
                                          {item?.role === "admin" ? (
                                            <img
                                              src={AdminImg}
                                              id="img"
                                              className="profileImg"
                                              alt=""
                                            />
                                          ) : senderDetails &&
                                            senderDetails?.image ? (
                                            <img
                                              src={senderDetails?.image}
                                              id="img"
                                              className="profileImg"
                                              alt=""
                                            />
                                          ) : (
                                            <span
                                              className="nameImgProfile"
                                              style={{
                                                backgroundColor: `${receiverImg}`,
                                              }}
                                            >
                                              {senderDetails?.name
                                                ? senderDetails?.name?.charAt(0)
                                                : ""}
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </>
                            );
                          })}
                    </InfiniteScroll>
                  </div>
                </div>
                <div className="chatDataFooter">
                  {/* <div className='chatButtonSend' >
                                    <input
                                        type="text"
                                        value={sendMessage}
                                        placeholder='Enter Message Hear...'
                                        onChange={(e) => setSendMessage(e.target.value)}
                                    />
                                    <div className='socialButton'>
                                        <Button
                                            bIcon={<LuPaperclip />}
                                            className={"media-icon"}
                                            type={"button"}
                                        />
                                        <Button
                                            bIcon={<IoIosSend />}
                                            type={"button"}
                                            className={"sendButtonIcon"}
                                            // onKeyPress={handleKeyPress}
                                            onClick={() => handleSendMessage()}
                                        />
                                    </div>
                                </div> */}
                </div>
                {/* <div className='chatDataFooter'>
                                {
                                    showUserName === "false" && (
                                        <div className='userNameModelShow'>
                                            <div className='userNameShow' onClick={() => handleSendUserName(receiverDetails)}>
                                                {
                                                    safeObjectValues(receiverDetails)?.length > 0 && receiverDetails?.image ?
                                                        <img src={receiverDetails?.image} />
                                                        : <span className='nameImgProfile' style={{ backgroundColor: `${receiverImg}` }}>{receiverDetails?.name ? receiverDetails?.name?.charAt(0) : ""}</span>

                                                }
                                                <h4>{safeObjectValues(receiverDetails)?.length > 0 && receiverDetails?.name}</h4>
                                            </div>
                                            <div className='userNameShow' onClick={() => handleSendUserName(senderDetails)}>
                                                {
                                                    safeObjectValues(senderDetails)?.length > 0 && senderDetails?.image ?
                                                        <img src={senderDetails?.image} />
                                                        : <span className='nameImgProfile' style={{ backgroundColor: `${receiverImg}` }}>{senderDetails?.name ? senderDetails?.name?.charAt(0) : ""}</span>

                                                }
                                                <h4>{safeObjectValues(senderDetails)?.length > 0 && senderDetails?.name}</h4>
                                            </div>
                                        </div>
                                    )
                                }
                                <form onSubmit={(e) => {
                                    e.preventDefault();
                                    handleSendMessage();
                                }}>
                                    <div className='chatButtonSend'>
                                        <MentionsInput
                                            value={sendMessage}
                                            style={{ position: "unset" }}
                                            className='inputChat'
                                            onChange={handleOnChange}
                                            suggestionsPortalHost={document.body}
                                            placeholder={"Mention people using '@'"}
                                            onKeyPress={handleKeyPressInput}
                                            allowSuggestionsAboveCursor
                                        >
                                            <Mention
                                                trigger="@"
                                                data={mentionsData && mentionsData || []}
                                                renderSuggestion={(suggestion, search, highlightedDisplay) => (
                                                    <div className="userMentionShow">
                                                        {
                                                            Object?.values(suggestion)?.length > 0 && suggestion?.image ?
                                                                <img src={suggestion?.image} />
                                                                : <span className='nameImgProfile' style={{ backgroundColor: `${receiverImg}` }}>{suggestion?.display ? suggestion?.display?.charAt(0) : ""}</span>

                                                        }
                                                        <span >{highlightedDisplay}</span>

                                                    </div>
                                                )}
                                                suggestionsPortalHost={document.body}
                                                displayTransform={(id, display) => `@${display}`}
                                                onAdd={hadnleAddData}
                                            />
                                        </MentionsInput>

                                        <div className='socialButton'>
                                            <label for="image" className={"media-icon"} onChange={handleUpload} >
                                                <LuPaperclip />
                                                <input
                                                    type="file"
                                                    name="image"
                                                    id="image"
                                                    style={{ position: "absolute", top: "-9999px" }}

                                                />
                                            </label>

                                            <Button
                                                bIcon={<IoIosSend />}
                                                type={"submit"}
                                                onKeyPress={handleKeyPress}
                                                className={"sendButtonIcon"}
                                            />
                                        </div>
                                    </div>
                                </form>
                            </div> */}
                {emojiShow && (
                  <div className="emojiModel">
                    <Button
                      className={"closeModel"}
                      onClick={() => setEmojiShow(false)}
                      bIcon={<AiFillCloseCircle />}
                    />
                    <Picker onEmojiClick={onEmojiClick} />
                  </div>
                )}
                <div className="chatDataFooter">
                  {showReplay && (
                    <div className="replayMessage">
                      <div
                        className="replayMessageShow"
                        style={{
                          borderColor: `${replayBorderColor[randomIndex]}`,
                        }}
                      >
                        <h6>{showReplay?.message}</h6>
                        <button onClick={() => setShowReplay(null)}>
                          <MdOutlineClose />
                        </button>
                      </div>
                    </div>
                  )}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendMessage();
                    }}
                    style={{
                      opacity: `${ticketData?.status === 2 ? "0.6" : "1"}`,
                    }}
                  >
                    <div className="chatButtonSend">
                      <MentionsInput
                        value={sendMessage}
                        style={{ position: "unset" }}
                        className="inputChat"
                        onChange={handleOnChange}
                        suggestionsPortalHost={document.body}
                        placeholder={"Type your message hear..."}
                        onKeyPress={handleKeyPressInput}
                        disabled={ticketData?.status === 2 ? true : false}
                        allowSuggestionsAboveCursor
                      >
                        <Mention
                          trigger="@"
                          data={(mentionsData && mentionsData) || []}
                          renderSuggestion={(
                            suggestion,
                            search,
                            highlightedDisplay
                          ) => (
                            <div className="userMentionShow">
                              {Object?.values(suggestion)?.length > 0 &&
                              suggestion?.image ? (
                                <img src={suggestion?.image} />
                              ) : (
                                <span
                                  className="nameImgProfile"
                                  style={{ backgroundColor: `${receiverImg}` }}
                                >
                                  {suggestion?.display
                                    ? suggestion?.display?.charAt(0)
                                    : ""}
                                </span>
                              )}
                              <span>{highlightedDisplay}</span>
                            </div>
                          )}
                          suggestionsPortalHost={document.body}
                          displayTransform={(id, display) => `@${display}`}
                          onAdd={hadnleAddData}
                        />
                      </MentionsInput>
                    </div>

                    <div className="socialButton">
                      <div className="buttonImg">
                        <label
                          for="image"
                          className={"media-icon"}
                          onChange={handleUpload}
                        >
                          <LuPaperclip />
                          <input
                            type="file"
                            name="image"
                            accept=".zip,image/*,.gif"
                            disabled={ticketData?.status === 2 ? true : false}
                            id="image"
                            style={{ position: "absolute", top: "-9999px" }}
                          />
                        </label>

                        <Button
                          bIcon={<BsEmojiSmile />}
                          type={"button"}
                          disabled={ticketData?.status === 2 ? true : false}
                          onClick={hadnleEMojiShow}
                          className={"emojiButtonIcon"}
                        />
                      </div>
                      <div className="sendIconButton">
                        <Button
                          bIcon={<IoMdSend />}
                          type={"submit"}
                          disabled={ticketData?.status === 2 ? true : false}
                          onKeyPress={handleKeyPress}
                          className={"sendButtonIcon"}
                        />
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            <div
              className="col-0 col-sm-4 col-md-4 col-lg-3 p-sm-0"
              id="responsiveViewDetails"
            >
              <div
                className="appInfoBg"
                style={{ display: "none" }}
                id="appInfoBgResponsive"
              ></div>
              <div className="appInfo">
                <Button
                  bIcon={<IoIosCloseCircle />}
                  className={"closeIcon"}
                  style={{ display: "none" }}
                  onClick={() => hadnleDetailsClose()}
                />
                <div className="appInfoHead">
                  <span>App Name</span>
                  <h5>{ticketData?.appName ? ticketData?.appName : ""}</h5>
                </div>
                <div className="appInfoBody">
                  {safeObjectValues(senderDetails)?.length > 0 &&
                  senderDetails?.image ? (
                    <img
                      src={senderDetails?.image ? senderDetails?.image : ""}
                      id="img"
                    />
                  ) : (
                    <h4
                      className="nameImgProfile"
                      style={{ backgroundColor: `${receiverImg}` }}
                    >
                      {senderDetails?.name
                        ? senderDetails?.name?.charAt(0)
                        : ""}
                    </h4>
                  )}
                  <h6>{senderDetails?.name}</h6>
                  <span>
                    {messageRole === "client" ? "Client" : "Developer"}
                  </span>
                </div>
                <div className="appInfoFooter">
                  <h6>Information</h6>
                  <ul>
                    <li>
                      <span>Ticket Id:</span>
                      <h5>
                        {ticketData?.ticketId ? ticketData?.ticketId : ""}
                      </h5>
                    </li>
                    <li>
                      <span>Date</span>
                      <h5>
                        {ticketData?.openAt
                          ? dayjs(ticketData?.openAt).format("DD MMM, YYYY")
                          : ""}
                      </h5>
                    </li>
                    <li>
                      <span>Issue Description</span>
                      <h5>
                        {ticketData?.issueDescription
                          ? ticketData?.issueDescription
                          : ""}
                      </h5>
                    </li>
                  </ul>
                  {messageRole === "developer" && (
                    <div className="d-flex justify-content-end">
                      <Button
                        text={"Close Ticket"}
                        style={{
                          opacity: `${ticketData?.status === 2 ? "0.8" : "1"}`,
                        }}
                        disabled={ticketData?.status === 2 ? true : false}
                        className={"btn btn-danger closeTicketMessage mt-2"}
                        onClick={() => hadnleTicketClose()}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {dialogueType === "ticketClosed" && <TicketClosedDialogue />}
      {dialogueType === "imageView" && <ImageViewDialogue />}
    </>
  );
}
