"use client";
import Button from "@/components/button"
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {FaEye, FaEyeSlash} from "react-icons/fa";
import { doCredentialsLogin } from "@/controllers/loginController";

export default function HeaderLogin({onLoginSuccess}) {
    const router = useRouter();
    
    const [user, setUser] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [showPwd, setShowPwd] = useState(false);

    const showPwdRef = useRef(null);

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd])

    useEffect(() => {
        errMsg.length > 0 && alert(errMsg);
    }, [errMsg])

     async function handleFormSubmit(event) {
        event.preventDefault();

        try {
            const formData = new FormData(event.currentTarget);
            const response = await doCredentialsLogin(formData);

            if (!!response.error) {
                setErrMsg(response.error.message);
            } else {
                await onLoginSuccess();
            }
        }
        catch (err) {
            setErrMsg(err.message);
        }
    }
    
    return (
        <form onSubmit={handleFormSubmit} className="flex gap-4 items-center">
            <div className="flex gap-2 items-center">
                <label className="text-sm">Username</label>
                <input className="text-sm" 
                    type="text"
                    id="user"
                    name="user"
                    maxLength={24}
                    onChange={(e) => setUser(e.target.value)}/>
            </div>
            <div className="flex gap-2 items-center">
                <label className="text-sm">Password</label>
                <input className="text-sm"
                    type={showPwd ? "text" : "password"}
                    id="password"
                    name="password"
                    autoComplete="off"
                    maxLength={24}
                    onChange={(e) => setPwd(e.target.value)} />
            </div>
            <div className="flex gap-2">
                <Button color="blue" content="Log in" style={`${!(user.length > 0 && pwd.length > 0) ? "opacity-50" : "opacity-100"}`} disabled={!(user.length > 0 && pwd.length > 0)} onClick={() => {}} />
                <Button color="gray" content="sign up" onClick={(e) => {
                    e.preventDefault();
                    router.push("/register");
                }}/>
            </div>
        </form>
    )
}