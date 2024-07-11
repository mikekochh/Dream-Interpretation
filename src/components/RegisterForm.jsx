"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import validator from 'validator';
import { useRouter } from 'next/navigation';
import { signIn } from "next-auth/react";
import axios from "axios";

export default function RegisterForm() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("password");
    const [error, setError] = useState("");
    const [registeringUser, setRegisteringUser] = useState(false);
    const [sentEmailVerification, setSentEmailVerification] = useState(false);

    const router = useRouter();

    const register = async (e) => {
        e.preventDefault();
        setRegisteringUser(true);
        setError("");
    
        if (!name || !email || !password) {
            setError("Please fill in all fields");
            setRegisteringUser(false);
            return;
        } else if (!validator.isEmail(email)) {
            setError("Please enter a valid email");
            setRegisteringUser(false);
            return;
        }
    
        try {
            const emailLower = email.toLowerCase();
    
            const res = await fetch(`api/user/${emailLower}`, {
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
                    email: emailLower,
                    password
                }),
            });
    
            const newUser = await resNewUser.json();
            const userID = newUser.newUser._id;
            const dreamID = localStorage.getItem('dreamID');
    
            if (dreamID) {
                await axios.post('api/dream/newUser', { userID, dreamID });
            }
    
            if (resNewUser.ok) {
                gtagCreateAccount();
    
                // create a whole new api endpoint, and this one gets used if the user has a dreamID

                if (dreamID) {
                    console.log("We have gotten here!");
                    await axios.post('api/sendFirstInterpretationEmail', { email: emailLower, dreamID })
                }
                else {
                    await axios.post('api/sendVerificationEmail', { email: emailLower });
                }

                
                setSentEmailVerification(true);
                await new Promise(resolve => setTimeout(resolve, 4000));

                const resSignIn = await signIn("credentials", {
                    email: emailLower,
                    password,
                    redirect: false
                });
    
                if (!dreamID) {
                    router.push('/interpret');
                } else {
                    router.push(`dreamDetails?dreamID=${dreamID}`);
                }
            }
        } catch (error) {
            setError("User registration failed!");
            setRegisteringUser(false);
            console.log("error: ", error);
        }
    };
    

    const gtagCreateAccount = () => {
        if (window.gtag) {
            window.gtag('event', 'created_account', {
                'event_category': 'Account Activity',
                'event_label': 'Create Account'
            });
        }
        else {
            console.error('gtag script not loaded yet');
        }
    }

    return (
        <div className='text-white'>
            <div className="p-5 rounded-lg border-t-4 border-white-400 border">
                <h1 className="golden-ratio-2 font-bold my-4">Create Account</h1>
                <form className="flex flex-col gap-3" onSubmit={register}>
                    <input
                        type="text"
                        placeholder="Name"
                        className="LoginInput golden-ratio-1 rounded-lg text-black"
                        onChange={(e) => setName(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Email"
                        className="LoginInput golden-ratio-1 rounded-lg text-black"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {/* <input type="password" placeholder="Password" className="LoginInput rounded-lg text-black" onChange={(e) => setPassword(e.target.value)} /> */}
                    {registeringUser ? (
                        <div className="bg-blue-500 text-white w-fit py-1 px-3 rounded-md mt-2 golden-ratio-1 text-center">
                            Registering user...
                        </div>
                    ) : (
                        <div className="flex justify-center">
                            <button className="bg-blue-500 rounded-lg py-2 text-white font-bold text-center w-full">
                                Register
                            </button>
                        </div>
                    )}
                    {error && (
                        <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
                            {error}
                        </div>
                    )}
                    <Link href={'/login'} className="mt-3 text-right golden-ratio-1">
                        Already have an account? <span className="underline">Log In</span>
                    </Link>
                </form>
            </div>
            {sentEmailVerification && (
                <PopUpMessage
                    message="We have sent you a verification email. You will need to verify your email to continue using our website. Redirecting you to your interpretation now..."
                />
            )}
        </div>
    );
}

const PopUpMessage = ({ message }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 text-white text-center p-4">
            <div className="bg-gray-800 p-6 rounded-lg golden-ratio-2">
                <p>{message}</p>
            </div>
        </div>
    );
};
