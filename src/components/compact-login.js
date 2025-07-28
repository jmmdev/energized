"use client";
import Button from "@/components/button"
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { doCredentialsLogin } from "@/controllers/loginController";
import { FaUser, FaKey } from "react-icons/fa";

export default function CompactLogin({onLoginSuccess, vertical}) {
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
        <form onSubmit={handleFormSubmit} className={`flex ${vertical && "w-full flex-col"} gap-4 items-center text-container`}>
            <div className={`${vertical && "w-full"} flex gap-2 items-center`}>
                <FaUser className="text-xl text-neutral-400" />
                <input className={`${vertical && "w-full"} rounded-xs border border-container`}
                    placeholder="Username or email"
                    type="text"
                    name="user"
                    maxLength={24}
                    onChange={(e) => setUser(e.target.value)}/>
            </div>
            <div className={`${vertical && "w-full"} flex gap-2 items-center`}>
                <FaKey className="text-xl text-neutral-400" />
                <input className={`${vertical && "w-full"} rounded-xs border border-container`}
                    placeholder="Password"
                    type={showPwd ? "text" : "password"}
                    name="password"
                    autoComplete="off"
                    maxLength={24}
                    onChange={(e) => setPwd(e.target.value)} />
            </div>
            <div className={`flex ${vertical && "flex-col w-full"} items-center gap-2`}>
                <Button color="blue" content="Log in" style={`${!(user.length > 0 && pwd.length > 0) ? "opacity-50" : "opacity-100"} ${vertical && "w-full"}`}
                disabled={!(user.length > 0 && pwd.length > 0)} onClick={() => {}} />
                <Button color="gray" content="sign up" style={vertical && "w-full"} onClick={(e) => {
                    e.preventDefault();
                    router.push("/register");
                }}/>
            </div>
        </form>
    )
}