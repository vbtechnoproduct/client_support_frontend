import React, { useEffect, useState } from 'react'
import { IoCloseSharp } from "react-icons/io5";
import Input from '../../../extras/Input';
import { closeDialog } from '../../../redux/slice/dialogueSlice';
import Button from '../../../extras/Button';
import { createDeveloper, updateDeveloper } from '../../../redux/slice/developerSlice'
import { useDispatch, useSelector } from 'react-redux';
import { requestForToken } from '../../../api/FirebaseConfig';


export default function DeveloperDialogue() {
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

    const handleSubmit = async (e) => {
        const getFcmToken = JSON.parse(sessionStorage.getItem("FCMToken"))
        if (!name ||
            !imagePath
        ) {
            let error = {};
            if (!name) error.name = "Name is Required"
            if (!imagePath) error.imagePath = "imagePath is Required"
            return setError({ ...error })
        } else {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("image", image);
            formData.append("fcmToken", getFcmToken);
            if (dialogueData) {
                let payload = {
                    data: formData,
                    id: dialogueData?._id
                }
                dispatch(updateDeveloper(payload))
                dispatch(closeDialog({ type: "developer" }))
            } else {
                let payload = {
                    data: formData,
                }
                dispatch(createDeveloper(payload))
                dispatch(closeDialog({ type: "developer" }))
            }
        }
    };



    return (
        <div className='dialog DeveloperDialog'>
            <div className='mainDiaogBox'>
                <div className='dialogHead'>
                    <h6>Create New  Developer</h6>
                    <IoCloseSharp onClick={() => dispatch(closeDialog({ type: "developer" }))} />
                </div>
                <div className='dialogBody'>
                    <div className='mb-3'>
                        <Input
                            type={`text`}
                            id={`name`}
                            name={`name`}
                            label={`Name`}
                            value={name}
                            placeholder={`Name`}
                            errorMessage={error.name && error.name}
                            onChange={(e) => {
                                setName(e.target.value);
                                if (!e.target.value) {
                                    return setError({
                                        ...error,
                                        name: `Name Id is Required`,
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
                    <div className='mb-3 image-show'>
                        <div className='imgInput'>
                            <label htmlFor="image" className="ms-2 order-1"> Image </label>
                            <input
                                type="file"
                                className="rounded-2"
                                id="image"
                                onChange={(e) => handleImage(e)}
                                accept='image/*'
                            />
                            {error &&
                                <p className="errorMessage text-start">{error && error?.image}</p>
                            }
                        </div>
                        <div className='imgShow'>
                            {
                                imagePath && (
                                    <img src={imagePath} />
                                )
                            }
                        </div>
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
