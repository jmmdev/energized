"use client";
import Button from "@/components/button"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { doCredentialsLogin } from "@/controllers/loginController";
import { FaUser, FaKey } from "react-icons/fa";

export default function CompactLogin({onLoginSuccess, vertical}) {
    const router = useRouter();
        
    const [user, setUser] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd])

    useEffect(() => {
        errMsg.length > 0 && alert(errMsg);
    }, [errMsg])

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        
        try {
            const formData = new FormData(event.currentTarget);
            
            await doCredentialsLogin(formData);
            
            await onLoginSuccess();
        }
        catch (err) {
            setErrMsg(err.message.replace("Error: ", ""));
        }
    }

    return (
        <form onSubmit={handleFormSubmit} action="/api/auth/callback/credentials"
        className={`flex ${vertical ? "w-full flex-col" : ""} gap-4 items-center text-background-2`}>
            <div className={`${vertical ? "w-full" : ""} flex gap-2 items-center`}>
                <FaUser className="text-xl text-neutral-400" />
                <input className={`${vertical ? "w-full" : ""} bg-my-white text-my-black rounded-xs border border-background-2`}
                    placeholder="Username or email"
                    type="text"
                    name="identifier"
                    maxLength={24}
                    onChange={(e) => setUser(e.target.value)}/>
            </div>
            <div className={`${vertical ? "w-full" : ""} flex gap-2 items-center`}>
                <FaKey className="text-xl text-neutral-400" />
                <input className={`${vertical ? "w-full" : ""} bg-my-white text-my-black rounded-xs border border-background-2`}
                    placeholder="Password"
                    type="password"
                    name="password"
                    autoComplete="off"
                    maxLength={24}
                    onChange={(e) => setPwd(e.target.value)} />
            </div>
            <div className={`flex ${vertical ? "flex-col w-full" : ""} items-center gap-2`}>
                <Button color="blue"type="submit"
                className={`rounded-xs px-2 text-my-white ${!(user.length > 0 && pwd.length > 0) ? "opacity-50" : "opacity-100"} ${vertical ? "w-full" : ""}`}
                disabled={!(user.length > 0 && pwd.length > 0)} onClick={() => {}}>
                    Log in
                </Button>
                <Button color="gray" className={`rounded-xs text-my-white px-2 ${vertical ? "w-full" : ""}`} onClick={(e) => {
                    e.preventDefault();
                    router.push("/register");
                }}>
                    sign up
                </Button>
            </div>
        </form>
    )
}