"use client";
import { useState, useEffect } from "react";
import { doCredentialsLogin } from "@/controllers/loginController";
import Button from "./button";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function LoginForm({onLoginSuccess}) {
    const [user, setUser] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [showPwd, setShowPwd] = useState(false);

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
            <h1 className="text-2xl font-medium border-b-2">Log in</h1>
            <form className="flex flex-col gap-8" action="/api/auth/callback/credentials" onSubmit={handleFormSubmit}>
                <div className="flex flex-col">
                    <label className="font-semibold">
                        Username or email
                    </label>
                    <input
                        className="border border-my-black bg-my-white text-my-black rounded-sm px-2 py-1 mb-1"
                        type="text"
                        id="user"
                        name="user"
                        maxLength={24}
                        onChange={(e) => setUser(e.target.value)}
                    />
                </div>
                <div className="flex flex-col">
                    <label className="font-semibold">
                        Password
                    </label>
                    <input
                        className="border border-my-black bg-my-white text-my-black rounded-sm pl-2 pr-8 py-1 mb-1"
                        type={showPwd ? "text" : "password"}
                        id="password"
                        name="password"
                        autoComplete="off"
                        maxLength={24}
                        onChange={(e) => setPwd(e.target.value)}
                    />
                </div>
                <Button color="blue" disabled={!(user.length > 0 && pwd.length > 0)} style="w-fit rounded px-4 py-2 self-center" content="Log in" />
            </form>
            
            <Button color="red" content="Sign in with Google" style="w-fit rounded p-2" onClick={() => signIn("google")} />

            <div>
                <p>Need an account?</p>
                <Link className="underline hover:text-highlight-hover" href="/register">Sign up</Link>
            </div>
            {errMsg.length > 0 && <p className="text-red-500">{errMsg}</p>}
        </section>
    </main>
  )
}