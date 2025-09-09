"use client";
import { useRef, useState, useEffect } from "react";
import {FaEye, FaCheck, FaTimes} from "react-icons/fa";
import { useRouter } from "next/navigation";
import axios from "axios";
import Button from "@/components/button";
import { getSession, signIn, useSession } from "next-auth/react";

const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%&]).{8,24}$/;
const EMAIL_REGEX = /^[a-z0-9._%+-]{1,64}@[a-z0-9.-]{1,185}\.[a-z]{2,4}$/;

export default function Register() {
    
    const router = useRouter();
    const nameRef = useRef();
    const showPwdRef = useRef();
    const showMatchRef = useRef();

    const [username, setUsername] = useState('');
    const [validName, setValidName] = useState(false);

    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(false);

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);

    const [match, setMatch] = useState('');
    const [validMatch, setValidMatch] = useState(false);

    const [msg, setMsg] = useState('');
    const [errMsg, setErrMsg] = useState('');

    const [showPwd, setShowPwd] = useState(false);
    const [showMatch, setShowMatch] = useState(false);

    const {data: session, status} = useSession();
    
    useEffect(() => {
        if (session)
            router.replace("/");
    }, [session])

    useEffect(() => {
        showPwdRef.current.addEventListener('click', () => {
            setShowPwd(showPwd => !showPwd);
        })
        showMatchRef.current.addEventListener('click', () => {
            setShowMatch(showMatch => !showMatch);
        })

        nameRef.current.focus();
    }, [])

    useEffect(() => {
        const result = USER_REGEX.test(username);
        setValidName(result);
    }, [username])

    useEffect(() => {
        const result = EMAIL_REGEX.test(email);
        setValidEmail(result);
    }, [email])

    useEffect(() => {
        const result = PWD_REGEX.test(pwd);
        setValidPwd(result);

        const isMatch = pwd === match;
        setValidMatch(isMatch);
    }, [pwd, match])

    useEffect(() => {
        setErrMsg('');
    }, [username, email, pwd, match])

    async function handleSubmit(event) {
        event.preventDefault();

        try {
            const formData = new FormData(event.currentTarget);

            const username = formData.get("username");
            const email = formData.get("email");
            const password = formData.get("password");

            await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/register`,{
                username: username,
                email: email,
                password: password
            });

            await refreshSession();
        }
        catch (err) {
            setErrMsg(err.response.data.message);
        }
    }

  return (
    <main className="flex flex-col items-center p-16">
        <section className="w-full max-w-[720px] flex flex-col gap-8">
            <h1 className="text-2xl font-medium border-b-2">Register</h1>
            <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
                <div className="flex flex-col">
                    <div className="flex items-center gap-1">
                        <label className="font-semibold" htmlFor="username">
                            Username
                        </label>
                        {validName && <FaCheck color="#8da" />}
                        {username.length > 0 && !validName && <FaTimes color="#f44" />}
                    </div>
                    <input
                        className={`${username.length > 0 ? validName ? "bg-emerald-100" : "bg-red-100" : ""} border border-gray-900 rounded-sm px-2 py-1 mb-1`}
                        type="text"
                        id="username"
                        name="username"
                        ref={nameRef}
                        autoComplete="off"
                        maxLength={24}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <p className="text-sm">4 to 24 characters. Must begin with a letter. Letters, numbers, underscores, hyphens allowed.</p>
                </div>
                <div className="flex flex-col">
                    <div className="flex items-center gap-1">
                        <label className="font-semibold" htmlFor="email">
                            Email
                        </label>
                        {validEmail && <FaCheck color="#8da" />}
                        {email.length > 0 && !validEmail && <FaTimes color="#f44" />}
                    </div>
                    <input
                        className={`${email.length > 0 ? validEmail ? "bg-emerald-100" : "bg-red-100" : ""} border border-gray-900 rounded-sm px-2 py-1 mb-1`}
                        type="text"
                        id="email"
                        name="email"
                        autoComplete="off"
                        maxLength={24}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="flex flex-col">
                    <div className="flex items-center gap-1">
                        <label className="font-semibold" htmlFor="password">
                            Password
                        </label>
                        {validPwd && <FaCheck color="#8da" />}
                        {pwd.length > 0 && !validPwd && <FaTimes color="#f44" />}
                    </div>
                    <div className="relative flex items-center gap-2">
                        <input
                            className={`${pwd.length > 0 ? validPwd ? "bg-emerald-100" : "bg-red-100" : ""} w-full border border-gray-900 rounded-sm pl-2 pr-8 py-1 mb-1`}
                            type={showPwd ? "text" : "password"}
                            id="password"
                            name="password"
                            autoComplete="off"
                            maxLength={24}
                            onChange={(e) => setPwd(e.target.value)}
                            required
                        />
                        <div ref={showPwdRef} className={`${!(pwd.length > 0) && "hidden"} absolute cursor-pointer right-0 w-8 text-gray-600 hover:text-gray-500 active:text-gray-900`}>
                            <FaEye className="w-full " />
                        </div>
                    </div>
                    <p className="text-sm">8 to 24 characters. Must include uppercase and lowercase letters, a number and a special character.</p>
                </div>
                <div className="flex flex-col">
                    <div className="flex items-center gap-1">
                        <label className="font-semibold" htmlFor="match">
                            Repeat password
                        </label>
                        {match.length > 0 && validMatch && <FaCheck color="#8da" />}
                        {match.length > 0 && !validMatch && <FaTimes color="#f44" />}
                    </div>
                    <div className="relative flex items-center gap-2">
                        <input
                            className={`${match.length > 0 ? validMatch ? "bg-emerald-100" : "bg-red-100" : ""} w-full border border-gray-900 rounded-sm px-2 py-1 mb-1`}
                            type={showMatch ? "text" : "password"}
                            id="match"
                            name="match"
                            autoComplete="off"
                            maxLength={24}
                            onChange={(e) => setMatch(e.target.value)}
                            required
                        />
                        <div ref={showMatchRef} className={`${!(match.length > 0) && "hidden"} absolute cursor-pointer right-0 w-8 text-gray-600 hover:text-gray-500 active:text-gray-900`}>
                            <FaEye className="w-full" />
                        </div>
                    </div>
                </div>
                {errMsg.length > 0 && <p className="text-red-500">{errMsg}</p>}
                {msg.length > 0 && <p className="text-emerald-500">{msg}</p>}
                <Button color="blue" disabled={!validName || !validPwd || !validMatch} style="w-[fit-content_!important] self-center" content="sign up" />
            </form>
            
            <Button content="Sign in with Google" style="w-fit" onClick={() => signIn("google")} />
            
            <div>
                <p>Already registered?</p>
                <a className="hover:text-highlight-hover underline" href="/login">Sign in</a>
            </div>
        </section>
    </main>
  )
}

async function refreshSession() {
  await getSession({ triggerEvent: true });
}