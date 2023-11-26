"use client";
import Link from "next/link";
import { useState } from "react";
import validator from 'validator';
import { useRouter } from 'next/navigation';
import { signIn } from "next-auth/react";
import ContactAndPrivacyButtons from "./ContactAndPrivacyButtons";
import axios from "axios";

export default function RegisterForm() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("password");
    const [error, setError] = useState("");
    const [registeringUser, setRegisteringUser] = useState(false);

    const router = useRouter();

    const register = async (e) => {
        e.preventDefault();
        setRegisteringUser(true);
        setError("");

        // check if this user alread exists before registering them and sending them an email verification link

        if (!name || !email || !password) {
            setError("Please fill in all fields");
            setRegisteringUser(false);
            return;
        }
        else if (!validator.isEmail(email)) {
            setError("Please enter a valid email");
            setRegisteringUser(false);
            return;
        }

        try {
            const res = await fetch(`api/user/${email}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (res.ok) {
                setError("User already exists!");
                setRegisteringUser(false);
                return;
            }

            const resNewUser = await fetch('api/register', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    email,
                    password
                }),
            });
            

            if (resNewUser.ok) {
                const resSignIn = await signIn("credentials", { 
                    email,
                    password, 
                    redirect: false
                });

                router.replace("/characterSelection");
            }
        }
        catch (error) {
            setError("User registration failed!");
            setRegisteringUser(false);
            console.log("error: ", error);
            return;
        }
    }

    return (
        <div className='text-white'>
            <div className="p-5 rounded-lg border-t-4 border-white-400 border">
                <h1 className="text-xl font-bold my-4">Register Below</h1>
                <form className="flex flex-col gap-3" onSubmit={register}>
                    <input type="text" placeholder="Name" className="LoginInput rounded-lg text-black" onChange={(e) => setName(e.target.value)} />
                    <input type="text" placeholder="Email" className="LoginInput rounded-lg text-black" onChange={(e) => setEmail(e.target.value)} />
                    {/* <input type="password" placeholder="Password" className="LoginInput rounded-lg text-black" onChange={(e) => setPassword(e.target.value)} /> */}
                    { registeringUser && (
                        <div className="bg-blue-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
                            Registering user...
                        </div>
                    )}
                    <button className="bg-blue-500 rounded-lg py-2 text-white font-bold text-center">Register</button>
                    { error && (
                        <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
                            {error}
                        </div>
                    )}
                    <Link href={'/userLogin'} className="text-sm mt-3 text-right">
                        Already have an account? <span className="underline">Log In</span>
                    </Link>
                </form>
            </div>
        </div>
    )
}