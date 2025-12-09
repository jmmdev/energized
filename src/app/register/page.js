"use client";
import { useRef, useState, useEffect } from "react";
import {FaEye, FaCheck, FaTimes, FaSpinner} from "react-icons/fa";
import { useRouter } from "next/navigation";
import axios from "axios";
import Button from "@/components/button";
import { getSession, useSession } from "next-auth/react";
import Link from "next/link";

const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%&]).{8,24}$/;
const EMAIL_REGEX = /^[a-z0-9._%+-]{1,64}@[a-z0-9.-]{1,185}\.[a-z]{2,4}$/;

export default function Register() {
    const {data: session, status} = useSession();
    
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

    const [errMsg, setErrMsg] = useState('');

    const [showPwd, setShowPwd] = useState(false);
    const [showMatch, setShowMatch] = useState(false);

    const [submitting, setSubmitting] = useState(false);

    const formDataRef = useRef();
    
    useEffect(() => {
        if (status === "authenticated")
            router.replace("/");
    }, [status])

    useEffect(() => {
        if (showPwdRef.current && showMatchRef.current && nameRef.current) {
            showPwdRef.current.addEventListener('click', () => {
                setShowPwd(showPwd => !showPwd);
            })
            showMatchRef.current.addEventListener('click', () => {
                setShowMatch(showMatch => !showMatch);
            })
            nameRef.current.focus();
        }
    }, [showPwdRef.current, showMatchRef.current, nameRef.current])

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

        if (!submitting) {
            formDataRef.current = new FormData(event.currentTarget);
            setSubmitting(true);
        }
    }

    useEffect(() => {
        const submit = async () => {
            try {
                const formData = formDataRef.current;

                const username = formData.get("username");
                const email = formData.get("email");
                const password = formData.get("password");

                await axios.post(`/api/xapi/register`,{
                    username: username,
                    email: email,
                    password: password
                });

                router.replace("/login");
            }
            catch (err) {
                console.log(err);
                setErrMsg(err.response.data.error);
            }
        }
        
        if (submitting) {
            setErrMsg("");
            submit();
        }
    }, [submitting])

    useEffect(() => {
        if (submitting)
            setSubmitting(false);
    }, [errMsg])

    if (status === "unauthenticated")
        return (
            <main className="w-screen relative flex flex-col items-center p-16">
                <section className="relative w-full max-w-[720px] flex flex-col gap-8">
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
                                className={`${username.length > 0 ? validName ? "bg-emerald-100" : "bg-red-100" : "bg-my-white"}
                                border border-my-black text-my-black rounded-sm px-2 py-1 mb-1`}
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
                                className={`${email.length > 0 ? validEmail ? "bg-emerald-100" : "bg-red-100" : "bg-my-white"}
                                border border-my-black text-my-black rounded-sm px-2 py-1 mb-1`}
                                type="text"
                                id="email"
                                name="email"
                                autoComplete="off"
                                maxLength={40}
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
                                    className={`${pwd.length > 0 ? validPwd ? "bg-emerald-100" : "bg-red-100" : "bg-my-white"}
                                    w-full border border-my-black text-my-black rounded-sm pl-2 pr-8 py-1 mb-1`}
                                    type={showPwd ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    autoComplete="off"
                                    maxLength={24}
                                    onChange={(e) => setPwd(e.target.value)}
                                    required
                                />
                                <div ref={showPwdRef} className={`${!(pwd.length > 0) ? "hidden" : ""} absolute cursor-pointer right-0 w-8 text-gray-600 hover:text-gray-500 active:text-gray-900`}>
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
                                    className={`${match.length > 0 ? validMatch ? "bg-emerald-100" : "bg-red-100" : "bg-my-white"}
                                    w-full border border-my-black text-my-black rounded-sm px-2 py-1 mb-1`}
                                    type={showMatch ? "text" : "password"}
                                    id="match"
                                    name="match"
                                    autoComplete="off"
                                    maxLength={24}
                                    onChange={(e) => setMatch(e.target.value)}
                                    required
                                />
                                <div ref={showMatchRef} className={`${!(match.length > 0) ? "hidden" : ""} absolute cursor-pointer right-0 w-8 text-gray-600 hover:text-gray-500 active:text-gray-900`}>
                                    <FaEye className="w-full" />
                                </div>
                            </div>
                        </div>
                        {errMsg.length > 0 && <p className="text-red-400">{errMsg}</p>}
                        <Button type="submit" color="blue" disabled={!validName || !validPwd || !validMatch} className="w-fit rounded px-4 py-2 self-center">
                            sign up
                        </Button>
                    </form>
                    <p>
                        <span className="font-light">Already registered? </span>
                        <Link className="hover:decoration-highlight-hover active:decoration-highlight-active underline" href="/login">
                            Sign in
                        </Link>
                    </p>

                    {submitting &&
                        <div className="w-full h-full absolute top-0 left-0 z-10 bg-background/80 flex flex-col justify-center items-center gap-2 text-3xl">
                            <FaSpinner className="animate-spin" />
                            Signing up...
                        </div>
                    }
                </section>
            </main>
        )
    
    return null;
}

async function refreshSession() {
  await getSession({ triggerEvent: true });
}