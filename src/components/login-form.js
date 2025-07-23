"use client";
import { useRef, useState, useEffect } from "react";
import {FaEye, FaEyeSlash} from "react-icons/fa";
import { doSocialLogin } from "@/controllers/loginController";
import { doCredentialsLogin } from "@/controllers/loginController";

export default function LoginForm({onLoginSuccess}) {

    const showPwdRef = useRef();

    const [user, setUser] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [showPwd, setShowPwd] = useState(false);

    useEffect(() => {
        showPwdRef.current.addEventListener("click", () => {
            setShowPwd(showPwd => !showPwd);
        });
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd])

    async function handleFormSubmit(event) {
        event.preventDefault();

        try {
            const formData = new FormData(event.currentTarget);
            const response = await doCredentialsLogin(formData);

            if (!!response.error) {
                setErrMsg(response.error.message);
            }
            await onLoginSuccess();
        }
        catch (err) {
            setErrMsg(err.message);
        }
    }

  return (
    <main className="w-screen relative flex flex-col items-center p-16 z-10">
        <section className="w-full max-w-[720px] flex flex-col gap-8">
            <h1 className="text-2xl font-geist border-b-2">Log in</h1>
            <form className="flex flex-col gap-8" onSubmit={handleFormSubmit}>
                <div className="flex flex-col">
                    <label>
                        Email
                    </label>
                    <input
                        className="border border-gray-900 rounded-sm px-2 py-1 mb-1"
                        type="text"
                        id="user"
                        name="user"
                        maxLength={24}
                        onChange={(e) => setUser(e.target.value)}
                    />
                </div>
                <div className="flex flex-col">
                    <div className="flex items-center gap-1">
                        <label>
                            Password
                        </label>
                    </div>
                    <div className="relative flex items-center gap-2">
                        <input
                            className="w-full border border-gray-900 rounded-sm pl-2 pr-8 py-1 mb-1"
                            type={showPwd ? "text" : "password"}
                            id="password"
                            name="password"
                            autoComplete="off"
                            maxLength={24}
                            onChange={(e) => setPwd(e.target.value)}
                        />
                        <div ref={showPwdRef} className={`${!(pwd.length > 0) && "hidden"} absolute cursor-pointer right-0 w-8 text-gray-600 hover:text-gray-500 active:text-gray-900`} onClick={() => setShowPwd(!showPwd)}>
                            {showPwdRef ? <FaEyeSlash /> : <FaEye />}
                        </div>
                    </div>
                </div>
                <button type="submit"
                    className={`bg-gray-300 self-center px-4 py-1 rounded
                        ${!(user.length > 0 && pwd.length > 0) ? "opacity-50" : "opacity-100 hover:bg-gray-200 active:bg-gray-400 cursor-pointer"}`} 
                    disabled={!(user.length > 0 && pwd.length > 0)}>Sign in</button>
            </form>
            <form action={doSocialLogin}>
                <button type="submit" name="action" value="google">
                    Sign in with Google
                </button>
            </form>
            <p>
                Need an account?<br/>
                <span className="underline">
                    <a href="/register">Sign up</a>
                </span>
            </p>
            {errMsg.length > 0 && <p className="text-red-500">{errMsg}</p>}
        </section>
    </main>
  )
}