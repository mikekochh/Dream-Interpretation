"use client";
import Link from "next/link";
import { useState } from "react";
import validator from 'validator';

export default function RegisterForm() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const register = (e) => {
        if (!email || !password) {
            setError("Please fill in all fields");
            e.preventDefault();
        }
        else if (!validator.isEmail(email)) {
            setError("Please enter a valid email");
            e.preventDefault();
        }
        else {
            setError("");
        }
    }

    return (
        <div className='text-white grid place-items-center h-screen'>
            <div className="p-5 rounded-lg border-t-4 border-white-400 border">
                <h1 className="text-xl font-bold my-4">Register Below</h1>
                <form className="flex flex-col gap-3">
                    <input type="text" placeholder="Email" className="LoginInput rounded-lg text-black" onChange={(e) => setEmail(e.target.value)} />
                    <input type="password" placeholder="Password" className="LoginInput rounded-lg text-black" onChange={(e) => setPassword(e.target.value)} />
                    <Link className="bg-blue-500 rounded-lg py-2 text-white font-bold text-center" href={'/home'} onClick={register}>Register</Link>
                    { error && (
                        <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
                            {error}
                        </div>
                    )}
                    <Link href={'/login'} className="text-sm mt-3 text-right">
                        Already have an account? <span className="underline">Log In</span>
                    </Link>
                </form>
            </div>
        </div>
    )
}