"use client";
import Link from "next/link";
import { useState } from "react";
import validator from 'validator';
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import ContactAndPrivacyButtons from "./ContactAndPrivacyButtons";
import axios from "axios";

export default function LoginForm() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("password");
    const [error, setError] = useState(""); 
    const [sendVerifyEmail, setSendVerifyEmail] = useState(false);
    const [forgotPassword, setForgotPassword] = useState(false);
    const [logginIn, setLogginIn] = useState(false);

    const router = useRouter();

    const login = async (e) => {
        e.preventDefault();
        setSendVerifyEmail(false);
        setForgotPassword(false);
        setLogginIn(true);

        if (!email || !password) {
            setError("Please fill in all fields");
            setLogginIn(false);
            return;
        }
        else if (!validator.isEmail(email)) {
            setError("Please enter a valid email");
            setLogginIn(false);
            return;
        }
        else {
            setError("");
        }

        try {
            const resUserActivated = await axios.get('api/login/' + email);

            if (resUserActivated.data == null || resUserActivated.data == undefined || resUserActivated.data == false) {
                setError("Please register first");
                setLogginIn(false);
                return;
            }

            const res = await signIn("credentials", { 
                email,
                password, 
                redirect: false
            });

            if (res.error) {
                setError("Invalid Credentials");
                setForgotPassword(true);
                setLogginIn(false);
                return;
            }

            router.replace("/journal");            
        } catch (error) {
            setError("Login failed!");
            setLogginIn(false);
            console.log('error: ', error);
        }
    }

    const sendVerficationEmail = async (e) => {
        const res = await fetch('api/sendVerificationEmail', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email
            }),
        });

        if (!res.ok) {
            setError("Failed to send verification email");
            return;
        }

        router.replace(`/emailVerification?email=${email}`);
    }

    const sendForgotPassword = async (e) => {
        const res = await fetch('api/forgotPassword', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email
            }),
        });

        if (!res.ok) {
            setError("Failed to send password reset email");
            return;
        }

        router.replace(`/passwordReset?email=${email}`);
    }

    return (
        <div>
            <div className='text-white grid place-items-center h-screen z-0'>
                <div className="p-5 rounded-lg border-t-4 border-white-400 border">
                    <h1 className="text-xl font-bold my-4">Enter Login Details</h1>
                    <form className="flex flex-col gap-3" onSubmit={login}>
                        <input type="text" placeholder="Email" className="LoginInput rounded-lg text-black" onChange={(e) => setEmail(e.target.value)} />
                        {/* <input type="password" placeholder="Password" className="LoginInput rounded-lg text-black" onChange={(e) => setPassword(e.target.value)} /> */}
                        <button className="bg-blue-500 rounded-lg py-2 text-white font-bold text-center" onClick={login}>Login</button>
                        <div className="flex">
                            { error && (
                                <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2 mr-1">
                                    {error}
                                </div>
                            )}
                            { sendVerifyEmail && (
                                <div className="bg-blue-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2 ml-1">
                                    <button onClick={sendVerficationEmail} className="underline">
                                        Send Again?
                                    </button>
                                </div>
                            )}
                            { logginIn && (
                                <div className="bg-blue-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
                                    Loggin in...
                                </div>
                            )}
                            { forgotPassword && (
                                <div className="bg-blue-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2 ml-1">
                                    <button onClick={sendForgotPassword} className="underline">
                                        Forgot Password?
                                    </button>
                                </div>
                            )}
                        </div>
                        <Link href={'/createAccount'} className="text-sm mt-3 text-right">
                            Don&apos;t have an account? <span className="underline">Register</span>
                        </Link>
                    </form>
                </div>
                <ContactAndPrivacyButtons />
            </div>
        </div>
    )
}