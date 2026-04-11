import { EyeClosed, EyeIcon, X } from "lucide-react";
import { useContext, useState } from "react";
import { StoreGlobal } from "../Store";

function Register({ setShowRegister, setShowLogin }) {

    const { setPopup, setPopupMsg } = useContext(StoreGlobal);
    const [registerUser, setRegisterUser] = useState({
        userName: '',
        email: '',
        password: '',
    });
    const [ conformPwd, setConformPwd ] = useState('');
    const [checkpwd, setCheckpwd] = useState(false);

    function onChangeHandler() {
        const { name, value } = event.target;
        if(name=='userName') {
            setRegisterUser(pre=>({
                ...pre,
                userName:value
            }));
            return;
        } else if(name=='email') {
            setRegisterUser(pre=>({
                ...pre,
                email:value
            }));
            return;
        } else {
            setRegisterUser(pre=>({
                ...pre,
                password:value
            }));
            return;
        }
    }

    function onRegister() {
        event.preventDefault();
        const tempUsername = String(registerUser.userName).trim();
        const tempEmail = String(registerUser.email).trim();
        const tempPwd = String(registerUser.password).trim();
        const tempRePwd = String(conformPwd).trim();
        if(tempUsername && tempEmail && (tempPwd == tempRePwd)) {
            console.log({registerUser})
        } else {
            setPopupMsg({
                heading:'Required',
                message:`Please enter ${!tempUsername ? 'username':''} ${!tempEmail ? 'email':''} 
                            ${(!tempPwd ||  !tempRePwd || (tempPwd == tempRePwd)) ? 'password':''}`
            });
            setPopup(true);
        }
    }

    return (
        <>
            <div className="fixed h-full z-50 inset-0 w-full backdrop-blur-sm flex justify-center items-center text-white">
                <form action=""
                    className="w-125 mx-2 bg-black/50 h-125 rounded-4xl flex flex-col justify-between items-center p-2"
                    onSubmit={onRegister}>
                    <div className="flex justify-around items-center h-1/6">
                        <h1 className="text-3xl">New Register</h1>
                        <X className="h-10 w-10 absolute transform translate-x-38 cursor-pointer" onClick={() => setShowRegister(false)} />
                    </div>
                    <div
                        className="w-75 flex-1 flex flex-col gap-5 justify-center items-center"
                    >
                        <input
                            type="text" name="userName" id=""
                            required
                            className="w-full p-3 border rounded-md"
                            placeholder="Enter username"
                            value={registerUser.userName} onChange={onChangeHandler} />
                        <input
                            type="email" name="email" id=""
                            required
                            className="w-full p-3 border rounded-md  "
                            placeholder="Enter email"
                            value={registerUser.email} onChange={onChangeHandler} />
                        <span className="relative w-full flex flex-row items-center">
                            <input
                                type="text" name="password" id=""
                                required
                                className="w-full p-3 pr-12 border rounded-md"
                                placeholder="Enter password"
                                value={registerUser.password} onChange={onChangeHandler} />
                            <div className="absolute right-3 cursor-pointer hover:text-black"
                                onClick={() => setCheckpwd(!checkpwd)}>
                                {
                                    checkpwd ? <EyeClosed size={20} /> : <EyeIcon size={20}/>
                                }
                            </div>
                        </span>
                        <span className="relative w-full flex items-center">
                            <input
                                type={checkpwd ? "text" : "password"}
                                placeholder="Re-enter password"
                                required
                                className="w-full p-3 border rounded-md"
                                value={conformPwd}
                                onChange={(e) => setConformPwd(e.target.value)}
                            />
                            <div
                                className="absolute right-3 cursor-pointer hover:text-black"
                                onClick={() => setCheckpwd(!checkpwd)}
                            >
                                {checkpwd ? <EyeClosed size={20} /> : <EyeIcon size={20} />}
                            </div>
                        </span>
                    </div>
                    <div className="flex flex-col justify-center items-center h-1/6 gap-2">
                        <button className="bg-blue-500 p-2 rounded-xl">SignIn</button>
                        <span className="flex flex-row gap-2">
                            <span>Already have account?</span>
                            <span className="text-red-500 cursor-pointer"
                                onClick={() => {
                                    setShowRegister(false);
                                    setShowLogin(true);
                                }}>
                                login</span>
                        </span>
                    </div>
                </form>
            </div>
        </>
    )
}

export default Register;