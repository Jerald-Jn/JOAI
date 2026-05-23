import { EyeClosed, EyeIcon, X } from "lucide-react";
import { useContext, useState } from "react";
import { StoreGlobal } from "../Store";
import { login } from "../service/Api";
import { toast } from "react-toastify";

function Login({setShowLogin, setShowRegister, fetchChats}) {
    
    const { setPopup, setPopupMsg } = useContext(StoreGlobal);
    const [ user, setUser ] = useState({
        userName : '', password : ''
    });
    const [checkpwd, setCheckpwd] = useState(false);

    function onHandler() {
        const { name, value } = event.target;
        if(name=="userName") {
            setUser(pre=>({
                ...pre,
                userName:value
            }));
        } else {
            setUser(pre=>({
                ...pre,
                password:value
            }));
        }
    }

    async function onLogin() {
        event.preventDefault();
        let missingFields = [];
        if(!String(user.userName).trim()) {
            missingFields.push('username')
        }
        if(!String(user.password).trim()) {
            missingFields.push('password')
        }
        try {
            if (missingFields.length == 0) {
                const response = await login(user);
                if (response.status < 300) {
                    localStorage.setItem("token",response.data);
                    await fetchChats();
                    setShowLogin(false);
                    toast.success("Successfully loggedIn");
                } else {
                    toast.warn(response.data);
                }
            } else {
                setPopupMsg({
                    heading: 'Required',
                    message: `Please enter ${missingFields.join(', ')}`
                });
                setPopup(true);
                return;
            }
        } catch (error) {
            setPopupMsg({
                heading: error?.code ? error.code : 'Server error',
                message: error.message ? error.message : 'Please refresh browser.'
            });
            setPopup(true)
        }
    }

    return (
        <>
            <div className="fixed h-full inset-0 z-50 text-white flex justify-center items-center backdrop-blur-sm">
                    <form onSubmit={onLogin} className="bg-black/50 max-w-md w-full h-87.5 m-2 flex flex-col text-center rounded-2xl items-center justify-evenly p-4" >
                        <div className="relative w-full flex items-center justify-center">
                            <h1 className="text-3xl">Welcome Back</h1>
                            <X
                            onClick={()=>setShowLogin(false)}
                            className="absolute right-3 cursor-pointer text-4xl h-10 w-10"
                            />
                        </div>
                        <div className="flex flex-col flex-1 justify-evenly items-center w-3/5">
                            <input type="text" name="userName" id="userName"
                                placeholder="Enter username"
                                required
                                className="w-full  p-2 border rounded-md"
                                value={user.userName} 
                                onChange={onHandler} />
                            <span className="relative w-full flex items-center">
                            <input
                                type={checkpwd ? "text" : "password"}
                                name="password" id="password"
                                placeholder="Enter password"
                                required
                                className="w-full p-2 border rounded-md  "
                                value={user.password}
                                onChange={onHandler}
                            />
                            <div
                                className="absolute right-3 cursor-pointer hover:text-black"
                                onClick={() => setCheckpwd(!checkpwd)}
                            >
                                {checkpwd ? <EyeClosed size={20} /> : <EyeIcon size={20} />}
                            </div>
                        </span>
                        </div>
                        <div className="h-1/5 flex-col justify-center items-center gap-2">
                            <button 
                                className="bg-blue-600 rounded-md p-2 cursor-pointer"
                                >LogIn
                            </button>
                            <p className="mt-2">Don't have accout?
                                <span 
                                    className="cursor-pointer ml-2 text-red-500"
                                    onClick={()=>{
                                        setShowRegister(true);
                                        setShowLogin(false);
                                    }}>
                                    Register
                                </span>
                            </p>
                        </div>
                    </form>
            </div>
        </>
    );
}
export default Login;