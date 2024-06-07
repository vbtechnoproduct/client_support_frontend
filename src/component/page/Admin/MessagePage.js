/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useRef, useState } from "react";
import Title from "../../extras/Title";
import $ from "jquery";
import NoImg from "../../../assets/images/noImg.png";
import AvtarImgAdmin from "../../../assets/images/AvtarImg.png";
import chatBg from "../../../assets/images/chatBg.jpg";
import { IoMdSend } from "react-icons/io";
import { LuPaperclip } from "react-icons/lu";
import {
  getMessageData,
  getMessageOldChat,
  closeTicket,
  imgUploadAdminChat,
} from "../../redux/slice/messageSlice";
import { sendChatImage } from "../../redux/clientDevSlice/messageClientSlice";
import { BsFileEarmarkZipFill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { IoChevronBack } from "react-icons/io5";
import InfiniteScroll from "react-infinite-scroll-component";
import { LuReply } from "react-icons/lu";
import { AiFillCloseCircle } from "react-icons/ai";
import dayjs from "dayjs";
import { MdOutlineClose } from "react-icons/md";
import { io } from "socket.io-client";
import { IoIosArrowDown } from "react-icons/io";
import { IoChevronBackSharp } from "react-icons/io5";
import { BsEmojiSmile } from "react-icons/bs";
import { IoIosCloseCircle } from "react-icons/io";
import { MdOutlineFileDownload } from "react-icons/md";
import { FaAngleDown } from "react-icons/fa6";
import { BsThreeDotsVertical } from "react-icons/bs";
import { CiSearch } from "react-icons/ci";
import { baseURL } from "../../utils/config";
import { IoChevronBackCircle } from "react-icons/io5";
import Button from "../../extras/Button";
import { DangerRight } from "../../api/toastServices";
import { Mention, MentionsInput } from "react-mentions";
import { AvtarImg } from "../../extras/AvtarImg";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import notificationSound from "../../../assets/notificationSound.mp3";
import Picker from "emoji-picker-react";
import { NavLink } from "react-router-dom";
import ImageViewDialogue from "./dialogue/ImageViewDialogue";
import { openDialog } from "../../redux/slice/dialogueSlice";

dayjs.extend(utc); // Extend dayjs with utc plugin
dayjs.extend(timezone);
export default function MessagePage() {
  const replayBorderColor = [
    "#007bfc",
    "#007bfc",
    "#53bdeb",
    "#a5b337",
    "#53bdeb",
    "#06cf9c",
  ];
  const randomIndex = Math.floor(Math.random() * replayBorderColor?.length);
  const { dialogue, dialogueType } = useSelector((state) => state.dialogue);

  const {
    messageAdmin,
    totalMessageAdmin,
    messageAdminOldChat,
    totalAdminOldChat,
    adminGrupeUserName,
  } = useSelector((state) => state.messageAdmin);
  const bgProfileColor = [
    "rgb(255, 58, 110)",
    "rgb(255, 58, 110)",
    "rgb(108, 117, 125",
    "rgb(255, 162, 29)",
    "rgb(111, 217, 67)",
  ];
  const dispatch = useDispatch();
  const [start, setStart] = useState(1);
  const [limit, setLimit] = useState(100);
  const [emojiShow, setEmojiShow] = useState(false);
  const [userDetailShow, setUserDetailShow] = useState({});
  const [sendMessage, setSendMessage] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [mentionsData, setMentionsData] = useState([]);
  const [allChatData, setAllChatData] = useState([]);
  const [senderDetails, setSenderDetails] = useState({});
  const [receiverImg, setReceiverImg] = useState("");
  const [hasMoreUser, setHasMoreUser] = useState(false);
  const [search, setSearch] = useState("");
  const [moMessageShowBody, setMoMessageShowBody] = useState(false);
  const [receiverDetails, setReceiverDetails] = useState({});
  const [clientImage, setClientImg] = useState();
  const [focusedIndex, setFocusedIndex] = useState(null);
  const [ticketStatus, setTicketStatus] = useState();
  const [showReplay, setShowReplay] = useState(null);
  const [chatData, setChatData] = useState([]);
  const emojiRefModel = useRef(null);
  // const [developerDetails,setDeveloperDetails]=useState("")
  // const [clientDetails,setClientDetails]=useState("")
  const socketRef = useRef(null);
  const chatContainerRef = useRef(null);
  const [data, setData] = useState([]);
  const [userProfileStart, setUserProfileStart] = useState(1);
  const [userProfileLimit, setUserProfileLimit] = useState(20);
  const [messageChat, setMessageChat] = useState();
  const [showUserName, setShowUserName] = useState(false);
  const getDeveloperData = JSON.parse(sessionStorage.getItem("admin"));
  const safeObjectValues = (obj) => obj && Object.values(obj);

  useEffect(() => {
    if (messageAdmin?.length > 0) {
      setData(messageAdmin);
      setReceiverDetails(messageAdmin[0]?.receiver);
      setSenderDetails(messageAdmin[0]?.sender);
      setUserDetailShow(messageAdmin[0]);
      setTicketStatus(messageAdmin[0]?.ticket?.status);
      setClientImg(AvtarImg[0]);
    }
  }, [messageAdmin]);

  const handleOnChat = (data, img) => {
    if (Object?.values(data)?.length > 0) {
      setClientImg(img);
      setUserDetailShow(data);
      setReceiverDetails(data?.receiver);
      setSenderDetails(data?.sender);
      setTicketStatus(data?.ticket?.status);
    }
    const mediaQueryList = window.matchMedia("(max-width: 768px)");
    if (mediaQueryList?.matches) {
      $("#chatMoView").css("display", "block");
      setMoMessageShowBody(true);
    }
  };
  useEffect(() => {
    if (Object?.values(userDetailShow)?.length > 0) {
      const socket = io.connect(baseURL, {
        transports: ["websocket", "polling", "flashsocket"],
        query: {
          globalRoom: userDetailShow && userDetailShow?.ticket?.ticketId,
        },
      });
      socketRef.current = socket ? socket : null;
      socketRef.current.on("connect", () => {
        console.log("Socket connected");
        socketRef.current.emit(
          "ticket",
          userDetailShow && userDetailShow?.ticket?.ticketId
        );
      });
      socketRef.current.on("disconnect", () => {
        console.log("Socket disconnected");
      });
      socketRef.current.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
        DangerRight(error);
      });
      return () => {
        console.log("Cleaning up socket connection");
        socketRef.current.disconnect();
      };
    }
  }, [userDetailShow]);

  const playRingtone = async () => {
    const audio = await new Audio(notificationSound);
    audio.play();
  };
  useEffect(() => {
    socketRef.current &&
      socketRef.current.on("message", (messageShow) => {
        playRingtone();
        if (
          messageShow?.chat?.messageType === 1 &&
          messageShow?.chat?.chatTopic === userDetailShow?._id
        ) {
          setAllChatData((prevState) => [...prevState, messageShow?.chat]);
          setMessageChat(messageShow?.chat);
        }
        // if (messageShow?.messageType === 2) {
        //     setAllChatData((prevState) => [...prevState, messageShow]);
        // }
        if (messageShow?.chatTopic === userDetailShow?._id) {
          if (messageShow?.messageType === 3) {
            setAllChatData((prevState) => [...prevState, messageShow]);
          }

          if (messageShow?.messageType === 2 && messageShow?.role !== "admin") {
            setAllChatData((prevState) => [...prevState, messageShow]);
          }
          if (
            messageShow?.messageType === 2 ||
            messageShow?.messageType === 3
          ) {
            setMessageChat(messageShow);
          }
        }

        // if (messageShow?.role !== "admin") {
        // }
      });
  }, [socketRef.current, senderDetails]);

  const onEmojiClick = (event, emojiObject) => {
    if (emojiObject && emojiObject.emoji) {
      setSendMessage(sendMessage + emojiObject.emoji);
    }
  };

  useEffect(() => {
    const payload = {
      start: userProfileStart,
      limit: userProfileLimit,
    };
    dispatch(getMessageData(payload));
  }, [userProfileStart, userProfileLimit]);

  const getRandomAvatar = () => {
    const randomIndex = Math.floor(Math.random() * AvtarImg.length);
    return AvtarImg[randomIndex];
  };

  $(document).ready(function () {
    $("img").bind("error", function () {
      // Set the default image
      $(this).attr("src", AvtarImgAdmin);
    });
  });
  useEffect(() => {
    if (Object?.values(userDetailShow)?.length > 0) {
      const payload = {
        id: userDetailShow?._id,
        start: start,
        limit: limit,
        loader: true,
      };
      dispatch(getMessageOldChat(payload));
    }
  }, [userDetailShow]);

  useEffect(() => {
    if (messageAdminOldChat) {
      setAllChatData(messageAdminOldChat);
    }
  }, [messageAdminOldChat]);

  function getRandomColor(colors) {
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  }
  const generateRandomId = () => {
    const timestamp = new Date().getTime().toString(16); // Convert current timestamp to hex string
    const randomStr = Math.random().toString(16).substring(2); // Generate a random hex string
    return timestamp + randomStr;
  };

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
  const formetAgoDate = (createdAtTimestamp) => {
    if (createdAtTimestamp) {
      const now = dayjs().tz("Asia/Kolkata");
      const diffInMinutes = now.diff(
        dayjs(createdAtTimestamp).tz("Asia/Kolkata"),
        "minute"
      );

      if (diffInMinutes < 1) {
        return "just now";
      } else if (diffInMinutes < 60) {
        return diffInMinutes + " min ago";
      } else if (
        now.diff(dayjs(createdAtTimestamp).tz("Asia/Kolkata"), "hour") >= 24
      ) {
        return dayjs(createdAtTimestamp)
          .tz("Asia/Kolkata")
          .format("DD MMM, YYYY");
      } else {
        return (
          now.diff(dayjs(createdAtTimestamp).tz("Asia/Kolkata"), "hour") +
          " hour ago"
        );
      }
    }
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
        chatTopicId: userDetailShow?._id,
        senderRole: "admin",
        sender: getDeveloperData?._id,
        message: newText,
        isReply: showReplay ? true : false,
        replyMessageId: showReplay ? showReplay?._id : null,
        mention: ids,
      };

      // setAllChatData((prevState) => [...prevState, chatData]);
      socketRef.current &&
        socketRef.current?.emit("message", {
          chatData,
        });
      setSendMessage("");

      const dateObject = new Date();
      const dateString = dateObject?.toISOString();

      const chatDataSet = {
        messageType: 1,
        chatTopic: userDetailShow?._id,
        role: "admin",
        sender: senderDetails?._id,
        message: newText,
        isReply: showReplay ? true : false,
        replyMessageId: showReplay ? showReplay?._id : null,
        _id: generateRandomId(),
        date: new Date().toLocaleString(),
        offlineMessage: true,
        createdAt: dateString,
      };
      setShowReplay(null);
      // setAllChatData((prevState) => [...prevState, chatDataSet]);
    }
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      // Handle the Enter key press, e.g., submit the form
      e.preventDefault(); // Prevent the default form submission behavior
      // Your logic here
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
        chatTopic: userDetailShow?._id,
        role: "admin",
        sender: senderDetails?._id,
        message: "📦 Zip",
        name: e.target.files[0]?.name,
        image: URL.createObjectURL(e.target.files[0]),
        _id: generateRandomId(),
        date: new Date().toLocaleString(),
        offlineMessage: true,
        loader: true,
        createdAt: dateString,
      };

      setAllChatData((prevState) => [...prevState, chatDataSet]);
      $(".messages__listData").animate(
        { scrollTop: $(document).height() },
        1000
      );
      const formData = new FormData();
      formData.append("chatTopic", userDetailShow?._id);
      formData.append("senderId", getDeveloperData?._id);
      formData.append("messageType", Number(3));
      formData.append("image", e.target.files[0]);
      const payload = {
        data: formData,
      };
      dispatch(imgUploadAdminChat(payload));
    } else {
      const dateObject = new Date();
      const dateString = dateObject?.toISOString();

      const chatDataSet = {
        messageType: 2,
        chatTopic: userDetailShow?._id,
        role: "admin",
        sender: senderDetails?._id,
        message: "📸 Image",
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
      formData.append("chatTopic", userDetailShow?._id);
      formData.append("senderId", getDeveloperData?._id);
      formData.append("messageType", Number(2));
      formData.append("image", e.target.files[0]);
      const payload = {
        data: formData,
        loader: false,
      };
      dispatch(imgUploadAdminChat(payload));
    }
  };

  const fetch = () => {
    setTimeout(() => {
      if (hasMore) {
        const payload = {
          id: userDetailShow?._id,
          start: start,
          limit: limit + 100,
          loader: false,
        };
        dispatch(getMessageOldChat(payload));
        setStart(start);
        setLimit(limit + 100);
        if (limit + 100 >= totalAdminOldChat) {
          setHasMore(false);
        }
      }
    }, 800);
  };

  const fetchUser = () => {
    setTimeout(() => {
      if (hasMoreUser) {
        const payload = {
          start: userProfileStart,
          limit: userProfileLimit + 20,
          loader: false,
        };
        dispatch(getMessageData(payload));
        setUserProfileStart(userProfileStart);
        setUserProfileLimit(userProfileLimit + 20);
        if (userProfileStart + 20 >= totalMessageAdmin) {
          setHasMoreUser(false);
        }
      }
    }, 800);
  };

  const handleSendUserName = (username) => {
    setSendMessage((prevState) => {
      const messageWithUsername = `${prevState} ${username}`;
      setShowUserName(false); // Close the username suggestion model
      return messageWithUsername;
    });
  };

  useEffect(() => {
    const uniqueObject = {};
    const uniqueData =
      allChatData &&
      allChatData?.filter((item) => {
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
  const scrollDivToTop = () => {
    const div = document.querySelector(".user__listData");
    if (div) {
      div.scrollTop = 0;
    }
  };
  useEffect(() => {
    scrollDivToTop();
  }, []);

  useEffect(() => {
    const lastChat = messageChat
      ? messageChat
      : allChatData[allChatData?.length - 1];
    const messageToUpdate = data?.find(
      (message) => message?._id === lastChat.chatTopic
    );
    if (messageToUpdate) {
      const updateData = {
        ...messageToUpdate,
        chat: {
          ...messageToUpdate?.chat,
          message: lastChat?.message,
        },
      };
      const filteredAllData = data?.filter(
        (data) => data?._id !== updateData?._id
      );
      const updatedAllData = [updateData, ...filteredAllData];
      if (updatedAllData) {
        setData(updatedAllData);
      }
    }
  }, [messageChat]);

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
        // Remove the highlighting after a certain duration (e.g., 2 seconds)
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
  const handleSearch = (event, filter) => {
    event.preventDefault();
    let searchValue = search
      ? search.toLowerCase()
      : event?.target?.value?.toLowerCase();
    if (searchValue || filter) {
      const filteredData = data.filter((item) => {
        if (filter) {
          return Object.keys(filter).every((key) => {
            return item[key] === filter[key];
          });
        } else {
          const senderName = item.sender ? item.sender.name.toLowerCase() : "";
          const receiverName = item.receiver
            ? item.receiver.name.toLowerCase()
            : "";

          return (
            senderName.includes(searchValue) ||
            receiverName.includes(searchValue) ||
            Object.values(item).some((value) =>
              typeof value === "string"
                ? value.toLowerCase().includes(searchValue)
                : false
            )
          );
        }
      });
      setData(filteredData);
    } else {
      setData(messageAdmin);
    }
  };
  const hadnleEMojiShow = () => {
    setEmojiShow(!emojiShow);
  };
  const hadnleAddData = (data, display) => {
    return <div>{display}</div>;
  };
  const key = focusedIndex !== null ? focusedIndex : "default";

  const handleKeyDownMention = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault(); // Prevent the cursor from moving
      setFocusedIndex((prevIndex) => {
        if (prevIndex === null || prevIndex === mentionsData.length - 1) {
          return 0;
        } else {
          return prevIndex + 1;
        }
      });
    } else if (e.key === "ArrowUp") {
      e.preventDefault(); // Prevent the cursor from moving
      setFocusedIndex((prevIndex) => {
        if (prevIndex === null || prevIndex === 0) {
          return mentionsData.length - 1;
        } else {
          return prevIndex - 1;
        }
      });
    }
  };

  const zipNameShow = (url) => {
    console.log("url", url);
    if (!url) return;
    const segments = url?.split(/[\\/]/);
    const filename = segments[segments?.length - 1];
    return filename;
  };

  useEffect(() => {
    const mediaQueryList = window.matchMedia("(max-width: 768px)");

    // Check if the media query matches
    if (mediaQueryList.matches) {
      $("#responsiveViewDetails").addClass("mobileDetailsChat");
      $("#chatMoView").css("display", "none");
    }

    // Add a listener for changes to the media query
    const listener = (event) => {
      if (event.matches) {
        $("#responsiveViewDetails").addClass("mobileDetailsChat");
      } else {
        $("#responsiveViewDetails").removeClass("mobileDetailsChat");
      }
    };
    mediaQueryList.addListener(listener);

    // Cleanup the listener when the component unmounts
    return () => {
      mediaQueryList.removeListener(listener);
      setMoMessageShowBody(false);
    };
  }, []);

  const handleBackMenu = () => {};

  const hadnleTicketClose = async () => {
    const payload = {
      id: userDetailShow?.ticket?._id,
    };
    let response = await dispatch(closeTicket(payload)).unwrap();
    if (response?.status) {
      setTicketStatus(2);
    }
  };

  const handleMobileChatView = () => {
    setMoMessageShowBody(false);
    $("#appInfoBgResponsive").css("display", "none");
    $(".appInfo").css("display", "none");
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

  const hadnleShowMModel = () => {
    $(".sidebarPage").each(function () {
      const currentDisplay = $(this).css("display");
      const newDisplay = currentDisplay === "none" ? "block" : "none";
      $(this).css("display", newDisplay);
    });
    $("#mainPageBgResponsive").each(function () {
      const currentDisplay = $(this).css("display");
      const newDisplay = currentDisplay === "block" ? "none" : "block";
      $(this).css("display", newDisplay);
    });
    $(".sidebarPage").each(function () {
      if ($(this).hasClass("sidebarPagemobile")) {
        $(this).removeClass("sidebarPagemobile");
      } else {
        $(this).addClass("sidebarPagemobile");
      }
    });
  };

  const hadnleReplayModelOpen = (item) => {
    setShowReplay(null);
    setShowReplay(item);
  };

  const handleZipDownload = (fileUrl, name) => {
    window.location.href = fileUrl;
  };

  return (
    <>
      <div className="messagePage adminPageChat">
        <div className="messageConetnt">
          <div className="row align-items-start moMessageBody">
            <div
              className={`leftSideChat col-md-3 col-12 md-p-0 `}
              style={{
                display: `${moMessageShowBody === true ? "none" : "block"}`,
              }}
            >
              <div className="chatUserShow">
                <div className="topHeadShowChat">
                  <div
                    className="backButtonClick"
                    onClick={() => hadnleShowMModel()}
                  >
                    <IoChevronBackSharp />
                  </div>
                  <h6>Messages</h6>
                  <div className="searchInput">
                    <CiSearch />
                    <input
                      type="text"
                      placeholder="Search for chat..."
                      onChange={handleSearch}
                    />
                  </div>
                </div>
                <div className="w-100 showUser">
                  <div className="chatDataHeader " id="user__listData">
                    <div className="allChatUserShow" id="scrollableDivHead">
                      {data?.length > 0 ? (
                        <InfiniteScroll
                          dataLength={data?.length}
                          next={fetchUser}
                          loader={
                            data?.length > 0 ? (
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
                          style={{
                            display: "flex",
                            flexDirection: "column-reverse",
                            overflow: "hidden",
                            marginBlock: "12px",
                          }}
                          inverse={true}
                          hasMore={hasMoreUser}
                          scrollableTarget="scrollableDivHead"
                        >
                          {data &&
                            data
                              ?.slice()
                              ?.reverse()
                              ?.map((item, index) => {
                                return (
                                  <div
                                    key={index}
                                    className={`userProfileContent ${
                                      item?._id ===
                                      (safeObjectValues(userDetailShow)
                                        ?.length > 0 && userDetailShow?._id)
                                        ? "activeChat"
                                        : ""
                                    }`}
                                    onClick={() =>
                                      handleOnChat(item, AvtarImg[index])
                                    }
                                  >
                                    <div className="userProfileBox grupeProfile">
                                      <div className="profileImgGrupe">
                                        {/* <img src={item?.receiver?.image ? item?.receiver?.image : getRandomAvatar()} /> */}
                                        <span
                                          className="nameImgProfile"
                                          style={{
                                            backgroundColor: `${item?.receiver?.colorCode}`,
                                          }}
                                        >
                                          {item?.receiver?.name
                                            ? item?.receiver?.name?.charAt(0)
                                            : ""}
                                        </span>
                                        <div className={`moOnline `}>
                                          <div
                                            className={`${
                                              item?.receiver?.isOnline
                                                ? "onlineButton"
                                                : "offlineButton"
                                            }`}
                                          ></div>
                                        </div>
                                        {/* <img src={item?.sender?.image} /> */}
                                      </div>
                                      <div className="profileText">
                                        <div className="ProfileName">
                                          <h6>{item?.receiver?.name}</h6>
                                          <span>{item?.chat?.message}</span>
                                        </div>
                                        <div className="timeTextShow">
                                          <h4>
                                            {formetAgoDate(
                                              item?.chat?.date
                                                ? item?.chat?.date
                                                : ""
                                            )}
                                          </h4>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                        </InfiniteScroll>
                      ) : (
                        <div className="notfound">Not Messages...</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className={`chatMessageShow  col-md-6 col-12 md-p-0 d-flex align-item-center justify-content-center  `}
            >
              <div
                className="chatDataShow"
                style={{
                  display: `${moMessageShowBody === true ? "block" : ""}`,
                }}
              >
                <>
                  <div className="topchatHead">
                    {moMessageShowBody && (
                      <div
                        className="backCharMessage"
                        onClick={() => handleMobileChatView()}
                      >
                        <IoChevronBack />
                      </div>
                    )}
                    <div className="chatImgShow">
                      <div className="chatBodyGrupeImg">
                        {
                          <span
                            className="nameImgProfile"
                            style={{
                              backgroundColor: `${receiverDetails?.colorCode}`,
                            }}
                          >
                            {receiverDetails?.name
                              ? receiverDetails?.name?.charAt(0)
                              : ""}
                          </span>
                        }
                        <h6>
                          {" "}
                          {safeObjectValues(receiverDetails)?.length > 0 &&
                            receiverDetails?.name}
                        </h6>
                        {/* {
                                            safeObjectValues(senderDetails)?.length > 0 && senderDetails?.image ?
                                                <img src={senderDetails?.image ? senderDetails?.image : ""} id="img" />
                                                : <span className='nameImgProfile' style={{ backgroundColor: `${receiverImg}` }}>{senderDetails?.name ? senderDetails?.name?.charAt(0) : ""}</span>
                                        } */}
                      </div>
                    </div>
                    {moMessageShowBody && (
                      <div className="openDetailModel">
                        <Button
                          bIcon={<BsThreeDotsVertical />}
                          type={"button"}
                          onClick={hadnleShowDetailModel}
                          className={"menuIcon"}
                        />
                      </div>
                    )}
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
                              backgroundColor: "rgb(0, 167, 111)",
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
                            ?.map((item, index) => {
                              return (
                                <>
                                  {item?.role === "client" ||
                                  item?.role === "developer" ? (
                                    <div
                                      className="leftContent"
                                      id={item?._id}
                                      ref={chatContainerRef}
                                    >
                                      {item?.messageType === 4 ? (
                                        <h6
                                          className="mx-auto py-3 px-3 text-white  rounded-3"
                                          style={{
                                            backgroundColor:
                                              "rgb(108, 117, 125)",
                                          }}
                                        >
                                          {item?.message}
                                        </h6>
                                      ) : item?.messageType === 1 ? (
                                        <div
                                          className="leftChat"
                                          ref={chatContainerRef}
                                        >
                                          <div className="chatDataProfile">
                                            {item?.role === "client" ? (
                                              <span
                                                className="nameImgProfile"
                                                style={{
                                                  backgroundColor: `${receiverDetails?.colorCode}`,
                                                }}
                                              >
                                                {receiverDetails?.name
                                                  ? receiverDetails?.name?.charAt(
                                                      0
                                                    )
                                                  : ""}
                                              </span>
                                            ) : (
                                              <img
                                                src={senderDetails?.image}
                                                className="profileImg"
                                              />
                                            )}
                                          </div>
                                          <div className="messageShow">
                                            <div
                                              className={`messageBodyShow ${
                                                item?.message.includes(
                                                  "@client"
                                                )
                                                  ? "mentionStyle"
                                                  : ""
                                              } ${
                                                item?.isReply === true
                                                  ? "replayMessageBody"
                                                  : ""
                                              }`}
                                            >
                                              <button
                                                className="downarrowMessage "
                                                onClick={() =>
                                                  hadnleReplayModelOpen(item)
                                                }
                                              >
                                                <LuReply />
                                              </button>
                                              {/* <p>{item?.message}</p> */}
                                              {item?.isReply === true ? (
                                                <div
                                                  className="replayMessageText"
                                                  onClick={() =>
                                                    handleScrollViewMessage(
                                                      item
                                                    )
                                                  }
                                                >
                                                  <h6
                                                    style={{
                                                      borderColor: `${replayBorderColor[randomIndex]}`,
                                                    }}
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
                                                        part && (
                                                          <span
                                                            key={index}
                                                            className="mentionName"
                                                          >
                                                            {part}
                                                          </span>
                                                        )
                                                      ) : (
                                                        part && (
                                                          <span>{part}</span>
                                                        )
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
                                                      part && (
                                                        <span
                                                          key={index}
                                                          className="mentionName"
                                                        >
                                                          {part}
                                                        </span>
                                                      )
                                                    ) : (
                                                      part && (
                                                        <span key={index}>
                                                          {part}
                                                        </span>
                                                      )
                                                    )
                                                  )
                                              )}
                                            </div>
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
                                      ) : item?.messageType === 2 ? (
                                        <div
                                          className="leftChat messageShowImg"
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
                                            </div>
                                            <div className="UserameShow">
                                              <h6>
                                                {formatChatDate(
                                                  item?.createdAt
                                                )}
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
                                                  ? senderDetails?.name?.charAt(
                                                      0
                                                    )
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
                                                {formatChatDate(
                                                  item?.createdAt
                                                )}
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
                                                  ? senderDetails?.name?.charAt(
                                                      0
                                                    )
                                                  : ""}
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  ) : (
                                    <div
                                      className=""
                                      id={item?._id}
                                      ref={chatContainerRef}
                                    >
                                      {item?.messageType === 4 ? (
                                          <div
                                            className="d-flex justify-content-center"
                                          >
                                            <h6
                                              className="py-3 text-white rounded-3"
                                              style={{
                                                backgroundColor: "rgb(108, 117, 125)",
                                                display: 'inline-block',
                                                paddingLeft: '1rem',
                                                paddingRight: '1rem',
                                              }}
                                            >
                                              {item?.message}
                                            </h6>
                                          </div>

                                      ) : item?.messageType === 1 ? (
                                        <div
                                          className="rightChat"
                                          id="messages__listData"
                                        >
                                          <div className="messageShow">
                                            <div
                                              className={`messageBodyShow ${
                                                item?.isReply === true
                                                  ? "replayMessageBody"
                                                  : ""
                                              }`}
                                              id={item?._id}
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
                                              {/* {item?.message.split(new RegExp(`(@${senderDetails?.name}|@${receiverDetails?.name})`)).map((part, index) => (
                                                                                                        part.startsWith('@') && part !== `@${senderDetails?.name}` && part !== `@${receiverDetails?.name}`
                                                                                                            ? part && <span key={index} className='mentionName'>{part}</span>
                                                                                                            : part === `@${senderDetails?.name}` || part === `@${receiverDetails?.name}`
                                                                                                                ? part && <span key={index} className='mentionName'>{part}</span>
                                                                                                                : part && <span key={index} >{part}</span>
                                                                                                    ))} */}
                                              {item?.isReply === true ? (
                                                <div
                                                  className="replayMessageText"
                                                  onClick={() =>
                                                    handleScrollViewMessage(
                                                      item
                                                    )
                                                  }
                                                >
                                                  <h6
                                                    style={{
                                                      borderColor: `${replayBorderColor[randomIndex]}`,
                                                    }}
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
                                                          <span key={index}>
                                                            {part}
                                                          </span>
                                                        )
                                                  )
                                              )}
                                            </div>
                                            <div className="UserameShow">
                                              <h6>
                                                {formatChatDate(
                                                  item?.createdAt
                                                )}
                                              </h6>
                                            </div>
                                          </div>
                                          <div className="chatDataProfile">
                                            <img
                                              src={
                                                baseURL +
                                                getDeveloperData?.image
                                              }
                                              id="img"
                                              className="profileImg"
                                            />
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
                                              {/* <NavLink target={'_blank'} to={item?.image} style={{ cursor: "pointer" }} > */}
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
                                            </div>
                                            <div className="UserameShow">
                                              <h6>
                                                {formatChatDate(
                                                  item?.createdAt
                                                )}
                                              </h6>
                                            </div>
                                          </div>
                                          <div className="chatDataProfile">
                                            <img
                                              src={
                                                baseURL +
                                                getDeveloperData?.image
                                              }
                                              id="img"
                                              className="profileImg"
                                            />
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
                                                {formatChatDate(
                                                  item?.createdAt
                                                )}
                                              </h6>
                                            </div>
                                          </div>
                                          <div className="chatDataProfile">
                                            <img
                                              src={
                                                baseURL +
                                                getDeveloperData?.image
                                              }
                                              id="img"
                                              className="profileImg"
                                            />
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
                  {emojiShow && (
                    <div className="emojiModel" ref={emojiRefModel}>
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
                      style={{ opacity: `${ticketStatus !== 2 ? "1" : "0.6"}` }}
                    >
                      <div className="chatButtonSend">
                        <MentionsInput
                          value={sendMessage}
                          style={{ position: "unset" }}
                          className="inputChat"
                          key={key}
                          onChange={handleOnChange}
                          onKeyPress={handleKeyPressInput}
                          suggestionsPortalHost={document.body}
                          placeholder={"Type your message hear..."}
                          onKeyDown={handleKeyDownMention}
                          disabled={ticketStatus !== 2 ? false : true}
                          allowSuggestionsAboveCursor
                        >
                          <Mention
                            trigger="@"
                            data={(mentionsData && mentionsData) || []}
                            renderSuggestion={(
                              suggestion,
                              search,
                              highlightedDisplay,
                              index
                            ) => (
                              <div
                                className={`userMentionShow ${
                                  index === focusedIndex
                                    ? "selectedMention"
                                    : ""
                                }`}
                                style={{
                                  backgroundColor: `${
                                    index == focusedIndex ? "red" : ""
                                  }`,
                                }}
                              >
                                {Object?.values(suggestion)?.length > 0 &&
                                suggestion?.image ? (
                                  <img src={suggestion?.image} />
                                ) : (
                                  <span
                                    className="nameImgProfile"
                                    style={{
                                      backgroundColor: `${receiverImg}`,
                                    }}
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
                              disabled={ticketStatus !== 2 ? false : true}
                              id="image"
                              style={{ position: "absolute", top: "-9999px" }}
                            />
                          </label>
                          <Button
                            bIcon={<BsEmojiSmile />}
                            type={"button"}
                            disabled={ticketStatus !== 2 ? false : true}
                            onClick={() => setEmojiShow(!emojiShow)}
                            className={"emojiButtonIcon"}
                          />
                        </div>
                        <div className="sendIconButton">
                          <Button
                            bIcon={<IoMdSend />}
                            type={"submit"}
                            disabled={ticketStatus !== 2 ? false : true}
                            onKeyPress={handleKeyPress}
                            className={"sendButtonIcon"}
                          />
                        </div>
                      </div>
                    </form>
                  </div>
                </>
              </div>
            </div>
            <div
              className={` col-md-3 col-12 chatUserDetails `}
              id="responsiveViewDetails"
            >
              <div
                className="appInfoBg"
                style={{ display: "none" }}
                id="appInfoBgResponsive"
              ></div>
              <div className="appInfo adminInfo">
                <Button
                  bIcon={<IoIosCloseCircle />}
                  className={"closeIcon"}
                  style={{ display: "none" }}
                  onClick={() => hadnleDetailsClose()}
                />
                <div className="appInfoHead">
                  <span>App Name</span>
                  <h5>
                    {userDetailShow?.ticket?.appName
                      ? userDetailShow?.ticket?.appName
                      : ""}
                  </h5>
                </div>
                <div className="appInfoBody">
                  <div className="profileViewOth">
                    <div className="showProfileView">
                      {/* <img src={clientImage} /> */}
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
                      <span
                        className="nameImgProfile"
                        style={{
                          backgroundColor: `${receiverDetails?.colorCode}`,
                        }}
                      >
                        {receiverDetails?.name
                          ? receiverDetails?.name?.charAt(0)
                          : ""}
                      </span>
                      <h6>{receiverDetails?.name}</h6>
                      <span>{"Client"}</span>
                    </div>
                    <div className="showProfileView">
                      <div className="statusShow">
                        {senderDetails && (
                          <>
                            <div
                              className={`${
                                senderDetails?.isOnline
                                  ? "onlineButton"
                                  : "offlineButton"
                              }`}
                            ></div>

                            <h5>
                              {senderDetails
                                ? senderDetails?.isOnline
                                  ? "Online"
                                  : "Offline"
                                : ""}
                            </h5>
                          </>
                        )}
                      </div>
                      <img src={senderDetails?.image} />
                      <h6>{senderDetails?.name}</h6>
                      <span>{"Developer"}</span>
                    </div>
                  </div>
                </div>
                <div className="appInfoFooter">
                  <h6>Information:</h6>
                  <ul>
                    <li>
                      <span>Ticket Id:</span>
                      <h5>
                        {userDetailShow?.ticket?.ticketId
                          ? userDetailShow?.ticket?.ticketId
                          : ""}
                      </h5>
                    </li>
                    <li>
                      <span>Date</span>
                      <h5>
                        {userDetailShow?.createdAt
                          ? dayjs(userDetailShow?.createdAt).format(
                              "DD MMM, YYYY"
                            )
                          : ""}
                      </h5>
                    </li>
                    <li>
                      <span>Issue Description</span>
                      <h5>
                        {userDetailShow?.ticket?.issueDescription
                          ? userDetailShow?.ticket?.issueDescription
                          : ""}
                      </h5>
                    </li>
                  </ul>
                  <div className="d-flex justify-content-end">
                    {ticketStatus !== 2 && (
                      <Button
                        text={"Close Ticket"}
                        className={"btn btn-danger closeTicketMessage mt-2"}
                        onClick={hadnleTicketClose}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {dialogueType === "imageView" && <ImageViewDialogue />}
    </>
  );
}
