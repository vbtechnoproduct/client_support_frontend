import { configureStore } from "@reduxjs/toolkit"
import authSlice from "./slice/authSlice";
import dialogueSlice from "./slice/dialogueSlice";
import devDialogueSlice from "./devSlice/devDialogueSlice";
import devAuthSlice from "./devSlice/devAuthSlice";
import messageSlice from "./slice/messageSlice";
import clientSlice from "./slice/clientSlice";
import developerSlice from "./slice/developerSlice";
import ticketSlice from "./slice/ticketSlice";
import devMessageSlice from "./devSlice/devMessageSlice";
import messageClientSlice from "./clientDevSlice/messageClientSlice";

const store = configureStore({
    reducer: {
        auth: authSlice,
        dialogue: dialogueSlice,
        messageAdmin: messageSlice,
        clientAdmin: clientSlice,
        developerAdmin: developerSlice,
        ticketAdmin: ticketSlice,

        // Developer
        devAuth: devAuthSlice,
        devDialogue: devDialogueSlice,
        devMessage: devMessageSlice,
    
        //client   
        clientMessage: messageClientSlice,

    },
});

export default store;