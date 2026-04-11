import { Children, createContext, useState } from "react"

export const StoreGlobal = createContext(null); 

export function Store(prop) {
    const [popup, setPopup] = useState(false);
    const [popupMsg, setPopupMsg] = useState({
        heading: '',
        message: ''
    });

    const value = {
        popup,setPopup,
        popupMsg, setPopupMsg
    }

    return (
        <StoreGlobal.Provider value={value}>
            {prop.children}
        </StoreGlobal.Provider>
    )
}