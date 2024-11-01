"use client";
import Link from "next/link";
import { useState, useContext } from "react";
import validator from 'validator';
import { signIn } from "next-auth/react";
import axios from "axios";
import Image from "next/image";
import { SIGN_UP_TYPE_DREAM_INTERPRET } from "@/types/signUpTypes";
import { UserContext } from "@/context/UserContext";

export default function RegisterForm({ viewInterpretation = false }) {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [registeringUser, setRegisteringUser] = useState(false);
    const [sentEmailVerification, setSentEmailVerification] = useState(false);
    const [resendVerificationEmail, setResendVerificationEmail] = useState(false);

    const handleResendVerificationEmail = async () => {
        const dreamID = localStorage.getItem('dreamID');
        const emailLower = email.toLowerCase();

        if (dreamID) {
            await axios.post('api/sendFirstInterpretationEmail', { email: emailLower, dreamID })
        }
        else {
            await axios.post('api/sendVerificationEmail', { email: emailLower });
        }
        setSentEmailVerification(true);
    }

    const register = async (e) => {
        e.preventDefault();
        setRegisteringUser(true);
        setError("");
    
        if (!name || !email) {
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
                const resActivated = await fetch(`api/user/activated/${emailLower}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                const data = await resActivated.json();

                if (resActivated.ok) {
                    if (data.isActivated) {
                        setError("User already exists!");
                        setRegisteringUser(false);
                        return;
                    }
                    else {
                        setError("Please activate account");
                        setRegisteringUser(false);
                        setResendVerificationEmail(true);
                        return;
                    }
                }
            }
    
            const resNewUser = await fetch('api/register', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    email: emailLower,
                    signUpTypeID: SIGN_UP_TYPE_DREAM_INTERPRET
                }),
            });
    
            const newUser = await resNewUser.json();
            const userID = newUser.newUser._id;
            const dreamID = localStorage.getItem('dreamID');
    
            if (dreamID) {
                await axios.post('api/dream/newUser', { userID, dreamID });
            }

            await axios.post('/api/dream/streak/newStreak', { userID });
    
            if (resNewUser.ok) {
                gtagCreateAccount();
                if (dreamID) {
                    await axios.post('api/sendFirstInterpretationEmail', { email: emailLower, dreamID })
                }
                else {
                    await axios.post('api/sendVerificationEmail', { email: emailLower });
                }
                
                setSentEmailVerification(true);

                // do not sign them in until they activate their account

                if (!dreamID) {
                    const resSignIn = await signIn("credentials", {
                        email: emailLower,
                        password: "password",
                        redirect: false
                    });
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

    const signUpWithGoogle = async () => {
        localStorage.setItem("googleSignUp", true);
        await signIn('google');
    }

    return (
        <div className={`text-white ${viewInterpretation && 'bg-black rounded-xl bg-opacity-80'}`}>
            <div className={`p-5 rounded-lg border-t-4 border-white-400 border ${!viewInterpretation && 'Width350'}`}>
                <h1 className="golden-ratio-2 font-bold my-4 text-center w-2/3 mx-auto">{viewInterpretation ? 'Create Account to View Interpretation' : 'Create Account'}</h1>
                <form className="flex flex-col gap-3 w-full" onSubmit={(e) => {register(e)}}>
                    <input
                        type="text"
                        placeholder="Name"
                        className="LoginInput golden-ratio-1 rounded-lg text-black w-full"
                        onChange={(e) => setName(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Email"
                        className="LoginInput golden-ratio-1 rounded-lg text-black w-full"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {registeringUser ? (
                        <div className="bg-blue-500 text-white w-fit py-1 px-3 rounded-md mt-2 golden-ratio-1 text-center">
                            Registering user...
                        </div>
                    ) : (
                        <div className="flex justify-center">
                            <button className="bg-blue-500 rounded-lg py-2 text-white font-bold text-center w-full" type="submit">
                                Register
                            </button>
                        </div>
                    )}
                    <div className="flex items-center mt-2">
                        {error && (
                            <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md">
                                {error}
                            </div>
                        )}
                        {resendVerificationEmail && (
                            <button 
                                className="bg-blue-500 text-white w-fit text-sm py-1 px-3 rounded-md ml-auto cursor-pointer underline"
                                onClick={handleResendVerificationEmail}    
                            >
                                Resend email here
                            </button>
                        )}
                    </div>
                    <div className="flex justify-center my-2">
                        <span className="text-white">Or</span>
                    </div>
                    <div className="flex justify-center">
                        <button
                            type="button"
                            onClick={() => signUpWithGoogle()}
                            className="flex items-center bg-white rounded-lg py-1 text-black font-bold text-center w-full"
                        >
                            <div className="flex items-center justify-center w-full">
                                <Image src="/GoogleLogo.webp" className="rounded-lg mr-2" width={32} height={32} alt="logo" />
                                Sign up with Google
                            </div>
                        </button>
                    </div>
                    <Link href={'/login'} className="mt-3 text-right golden-ratio-1">
                        Already have an account? <span className="underline">Log In</span>
                    </Link>
                </form>
            </div>
            {sentEmailVerification && (
                <PopUpMessage
                    message="A verification email has been sent to you. Please verify your email address to interpret your dream. Thank you!"
                />
            )}
        </div>
    );
    
}

const PopUpMessage = ({ message }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 text-white text-center p-4 backdrop-blur z-50">
            <div className="bg-gray-800 p-6 rounded-lg">
                <p>{message}</p>
            </div>
        </div>
    );
};
