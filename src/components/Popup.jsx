import { useContext } from "react";
import { StoreGlobal } from "../Store";

function Popup({popupMsg, setPopupMsg}){
    const { heading, message} = popupMsg;
    console.log({heading,message})
    const { setPopup } = useContext(StoreGlobal);

    function onClose(){
        setPopupMsg({
            heading:'',
            message:''
        })
        setPopup(false);
    }
    
    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <div className="w-full transform translate-y-16 max-w-md rounded-2xl bg-white p-6 gap-2 shadow-xl flex flex-col justify-center items-center">
                    <h2 className="text-3xl font-bold text-black text-center">{heading}</h2>
                    <p className="mt-2 text-gray-600 text-center text-xl">{message}</p>
                    <button 
                        className="mt-4 rounded bg-red-700 px-4 py-2 relative transform translate-x-36 text-white hover:bg-red-500"
                        onClick={onClose}
                        >
                        Close
                    </button>
                </div>
            </div>
        </>
    )
}
export default Popup;