"use client";
import Link from "next/link";
import { useState } from "react";
import validator from 'validator';
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";

export default function LoginForm() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("password");
    const [error, setError] = useState(""); 
    const [sendVerifyEmail, setSendVerifyEmail] = useState(false);
    const [logginIn, setLogginIn] = useState(false);

    const router = useRouter();

    const login = async (e) => {
        e.preventDefault();
        setSendVerifyEmail(false);
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
            const emailLower = email.toLowerCase();
            const resUserActivated = await axios.get('api/login/' + emailLower);

            if (resUserActivated.data == null || resUserActivated.data == undefined || resUserActivated.data == false) {
                setError("Please register first");
                setLogginIn(false);
                return;
            }

            const res = await signIn("credentials", { 
                email: emailLower,
                password, 
                redirect: false
            });

            if (res.error) {
                setError("Invalid Credentials");
                setLogginIn(false);
                return;
            }

            router.push('/interpret');  
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

    return (
        <div>
            <div className='text-white grid place-items-center h-screen z-0 '>
                <div className="p-5 rounded-lg border-t-4 border-white-400 border Width350">
                    <h1 className="text-xl font-bold my-4">Enter Login Details</h1>
                    <form className="flex flex-col gap-3" onSubmit={(e) => {e.preventDefault(); login(e);}}>
                        <input type="text" placeholder="Email" className="LoginInput rounded-lg text-black" onChange={(e) => setEmail(e.target.value)} />
                        <button className="bg-blue-500 rounded-lg py-2 text-white font-bold text-center w-full" type="submit">Login</button>
                        { error && (
                            <div className="bg-red-500 text-white w-full text-sm py-1 px-3 rounded-md text-center">
                                {error}
                            </div>
                        )}
                        <div className="flex justify-center my-2">
                            <span className="text-white">Or</span>
                        </div>
                        <div className="flex justify-center">
                            <button
                                type="button"
                                onClick={() => signIn('google')}
                                className="flex items-center bg-white rounded-lg py-1 text-black font-bold text-center w-full"
                            >
                                <div className="flex items-center justify-center w-full">
                                    <Image src="/GoogleLogo.webp" className="rounded-lg mr-2" width={32} height={32} alt="logo" />
                                    Sign in with Google
                                </div>
                            </button>
                        </div>
                        <div className="flex justify-between">
                            { sendVerifyEmail && (
                                <div className="bg-blue-500 text-white w-fit text-sm py-1 px-3 rounded-md">
                                    <button onClick={sendVerficationEmail} className="underline">
                                        Send Again?
                                    </button>
                                </div>
                            )}
                            { logginIn && (
                                <div className="bg-blue-500 text-white w-fit text-sm py-1 px-3 rounded-md">
                                    Loggin in...
                                </div>
                            )}
                        </div>
                        <Link href={'/register'} className="text-sm text-right">
                            Don&apos;t have an account? <span className="underline">Register</span>
                        </Link>
                    </form>
                </div>
            </div>
        </div>
    )    
}
