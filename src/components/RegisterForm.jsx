"use client";
import Link from "next/link";
import { useState } from "react";
import validator from 'validator';
import { useRouter } from 'next/navigation';
import { signIn } from "next-auth/react";
import ContactAndPrivacyButtons from "./ContactAndPrivacyButtons";

export default function RegisterForm() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const router = useRouter();

    const register = async (e) => {
        e.preventDefault();

        if (!name || !email || !password) {
            setError("Please fill in all fields");
            return;
        }
        else if (!validator.isEmail(email)) {
            setError("Please enter a valid email");
            return;
        }

        try {

            const resUserExist = await fetch("api/userExists", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email
                }),
            });

            const { user } = await resUserExist.json();

            if (user) {
                setError("User already exists!");
                return;
            }

            const res = await fetch('api/register', {
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

            if (res.ok) {
                const form = e.target;
                form.reset();

                const loginRes = await signIn("credentials", { 
                    email,
                    password, 
                    redirect: false
                });
    
                if (loginRes.error) {
                    setError("Invalid Credentials");
                    return;
                }

                router.replace("/emailVerification");
                router.replace(`/emailVerification?email=${email}`);

            }
            else {
                setError("User registration failed!");
                return;
            }
        } catch (error) {
            setError("User registration failed!");
            console.log("error: ", error);
        }
    }

    return (
        <div className='text-white grid place-items-center h-screen'>
            <div className="p-5 rounded-lg border-t-4 border-white-400 border">
                <h1 className="text-xl font-bold my-4">Register Below</h1>
                <form className="flex flex-col gap-3" onSubmit={register}>
                    <input type="text" placeholder="Name" className="LoginInput rounded-lg text-black" onChange={(e) => setName(e.target.value)} />
                    <input type="text" placeholder="Email" className="LoginInput rounded-lg text-black" onChange={(e) => setEmail(e.target.value)} />
                    <input type="password" placeholder="Password" className="LoginInput rounded-lg text-black" onChange={(e) => setPassword(e.target.value)} />
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
            <ContactAndPrivacyButtons />
        </div>
    )
}