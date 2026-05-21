import { Children, createContext, useEffect, useState } from "react"
import { toast } from "react-toastify";

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

    useEffect(()=>{
        let timer1;

        window.addEventListener('offline',
            ()=>{
                toast.warn('Please check your network');
                timer1 = setInterval(() => {
                toast.warn('Please check your network');
            }, 5000)
            }
        );

        window.addEventListener('online',
            () => {
                toast.success('Back to network');
                if(timer1) {
                    clearInterval(timer1);
                }
            }
        );
        return ()=>{
            clearInterval(timer1);
        }
    },[]);

    return (
        <StoreGlobal.Provider value={value}>
            {prop.children}
        </StoreGlobal.Provider>
    )
}