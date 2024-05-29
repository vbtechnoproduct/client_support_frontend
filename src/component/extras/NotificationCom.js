import toast from "react-hot-toast";
import AdminImg from '../../assets/images/AvtarImg.png'
import '../../assets/css/notificationTost.scss'
import { useEffect } from "react";

let toastQueue = [];
export function tostMessage(imgShow, title, body, colorCode) {

    toastQueue.push({ imgShow, title, body, colorCode });
    if (toastQueue?.length > 2) {
        toastQueue?.splice(0, toastQueue?.length - 2);
        setTimeout(() => {
            if (toastQueue.length > 0) {
                toastQueue.shift();
            }
        }, 800);
    }

    toast.dismiss();
    toastQueue?.forEach(({ imgShow, title, body, colorCode }) => {
        toast.custom((t) => (
            <div className="notificationContent">
                <div className={`${true ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white shadow-lg rounded-lg notificationBoxShow pointer-events-auto flex border ring-1 ring-black ring-opacity-5`}>
                    <div className="flex-1 w-0 p-2 notificationBox">
                        <div className="flex flex-start">
                            <div className="flex-shrink-0 pt-0.5">
                                {

                                    imgShow ?
                                        <img
                                            className="h-10 w-10 rounded-circle"
                                            src={imgShow}
                                            alt=""
                                        />
                                        :
                                        colorCode?.length === 0
                                            ? <img
                                                className="h-10 w-10 rounded-circle"
                                                src={AdminImg}
                                                alt=""
                                            /> :
                                            < span className='nameImgProfile' style={{ backgroundColor: `${colorCode}` }}>{title ? title?.charAt(0) : ""}</span>

                                }
                            </div>
                            <div className="ml-3 flex-grow-1">
                                <h6 className="text-sm font-medium text-dark">
                                    {title}
                                </h6>
                                <p className=" text-sm text-secondary" style={{ marginTop: "0px" }}>
                                    {body}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex border border-left border-gray-200">
                        <button
                            onClick={() => toast.dismiss(t.id)}
                            className="w-full border border-top-0 border-end-0 border-bottom-0 rounded-0 rounded-end p-4 d-flex align-items-center justify-content-center text-sm font-medium text-primary hover-text-indigo focus-outline-none focus-ring-2 focus-ring-indigo"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div >
        ));
    });
}