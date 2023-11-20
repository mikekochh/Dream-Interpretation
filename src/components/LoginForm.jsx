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
    const [password, setPassword] = useState("");
    const [error, setError] = useState(""); 

    const router = useRouter();

    const login = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            setError("Please fill in all fields");
            return;
        }
        else if (!validator.isEmail(email)) {
            setError("Please enter a valid email");
            return;
        }
        else {
            setError("");
        }

        try {

            const resUserActivated = await axios.get('api/sendEmail', { params: { email }});

            if (resUserActivated.data.activated == false) {
                setError("Please verify your email");
                return;
            }

            const res = await signIn("credentials", { 
                email,
                password, 
                redirect: false
            });

            if (res.error) {
                setError("Invalid Credentials");
                return;
            }

            router.replace("/home");
            
        } catch (error) {
            setError("Login failed!");
            console.log('error: ', error);
        }
    }

    return (
        <div className='text-white grid place-items-center h-screen z-0'>
            <div className="p-5 rounded-lg border-t-4 border-white-400 border">
                <h1 className="text-xl font-bold my-4">Enter Login Details</h1>
                <form className="flex flex-col gap-3" onSubmit={login}>
                    <input type="text" placeholder="Email" className="LoginInput rounded-lg text-black" onChange={(e) => setEmail(e.target.value)} />
                    <input type="password" placeholder="Password" className="LoginInput rounded-lg text-black" onChange={(e) => setPassword(e.target.value)} />
                    <button className="bg-blue-500 rounded-lg py-2 text-white font-bold text-center" onClick={login}>Login</button>
                    { error && (
                        <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
                            {error}
                        </div>
                    )}
                    <Link href={'/register'} className="text-sm mt-3 text-right">
                        Don&apos;t have an account? <span className="underline">Register</span>
                    </Link>
                </form>
            </div>
            <ContactAndPrivacyButtons />
        </div>
    )
}