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
    const [isLogging, setIsLogging] = useState(false);

    const targetElement = useRef();

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd])

    useEffect(() => {
        setIsLogging(false);
        errMsg.length > 0 && alert(errMsg);
    }, [errMsg])

    useEffect(() => {
        if (targetElement.current)
            setIsLogging(true);
    }, [targetElement.current])
    
    useEffect(() => {
        const handleFormSubmit = async () => {
            try {
                const formData = new FormData(targetElement.current);
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

        if (isLogging) {
            handleFormSubmit();
        }
    }, [isLogging])

    
    
    return (
        <form onSubmit={(e) => {
            e.preventDefault();
            targetElement.current = e.currentTarget;
        }} action="/api/auth/callback/credentials"
        className={`flex ${vertical && "w-full flex-col"} gap-4 items-center text-container ${isLogging && "opacity-60"}`}>
            <div className={`${vertical && "w-full"} flex gap-2 items-center`}>
                <FaUser className="text-xl text-neutral-400" />
                <input className={`${vertical && "w-full"} bg-my-white text-my-black rounded-xs border border-container`}
                    disabled={isLogging}
                    placeholder="Username or email"
                    type="text"
                    name="identifier"
                    maxLength={24}
                    onChange={(e) => setUser(e.target.value)}/>
            </div>
            <div className={`${vertical && "w-full"} flex gap-2 items-center`}>
                <FaKey className="text-xl text-neutral-400" />
                <input className={`${vertical && "w-full"} bg-my-white text-my-black rounded-xs border border-container`}
                    disabled={isLogging}
                    placeholder="Password"
                    type="password"
                    name="password"
                    autoComplete="off"
                    maxLength={24}
                    onChange={(e) => setPwd(e.target.value)} />
            </div>
            <div className={`flex ${vertical && "flex-col w-full"} items-center gap-2`}>
                <Button color="blue"
                className={`rounded-xs px-2 text-my-white ${!(user.length > 0 && pwd.length > 0) ? "opacity-50" : "opacity-100"} ${vertical && "w-full"}`}
                disabled={user.length <= 0 || pwd.length <= 0 || isLogging} onClick={() => {}}>
                    Log in
                </Button>
                <Button color="gray" className={`rounded-xs text-my-white px-2 ${vertical && "w-full"}`} disabled={isLogging} onClick={(e) => {
                    e.preventDefault();
                    router.push("/register");
                }}>
                    sign up
                </Button>
            </div>
        </form>
    )
}