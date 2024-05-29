import React from 'react'
import { IoCloseSharp } from "react-icons/io5";
import { closeDialog } from '../../../redux/slice/dialogueSlice';
import { useDispatch, useSelector } from 'react-redux';


export default function ImageViewDialogue() {
    const dispatch = useDispatch()
    const { dialogue, dialogueData, dialogueType } = useSelector((state) => state.dialogue);

    return (
        <div className='dialog image-viewModel'>
            <div className='mainDiaogBox'>
                <div className='dialogHead'>
                    <IoCloseSharp onClick={() => dispatch(closeDialog({ type: "imageView" }))} />
                </div>
                <div className='dialogBody'>
                    <img src={dialogueData} />
                </div>
            </div>
        </div>
    )
}
