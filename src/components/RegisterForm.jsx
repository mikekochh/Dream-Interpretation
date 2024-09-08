"use client";
import Link from "next/link";
import { useState } from "react";
import validator from 'validator';
import { signIn } from "next-auth/react";
import axios from "axios";
import Image from "next/image";

export default function RegisterForm() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("password");
    const [error, setError] = useState("");
    const [registeringUser, setRegisteringUser] = useState(false);
    const [sentEmailVerification, setSentEmailVerification] = useState(false);

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

                if (!dreamID) {
                    const resSignIn = await signIn("credentials", {
                        email: emailLower,
                        password,
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

    const signUpWithGoogle = () => {
        localStorage.setItem("googleSignUp", true);
        signIn('google');
    }

    // const signUpWithGoogle = () => {
    //     localStorage.setItem("googleSignUp", true);
    
    //     const width = 500;
    //     const height = 600;
    //     const left = (window.innerWidth - width) / 2;
    //     const top = (window.innerHeight - height) / 2;
    
    //     // Open a popup window for Google sign-in
    //     const googleAuthWindow = window.open(
    //         '/api/auth/signin/google', // This assumes you're using NextAuth's default route for Google sign-in
    //         'Google Sign-In',
    //         `width=${width},height=${height},top=${top},left=${left}`
    //     );
    
    //     // Check when the popup is closed
    //     const checkAuth = setInterval(() => {
    //         if (googleAuthWindow.closed) {
    //             clearInterval(checkAuth);
    //             // Handle the result after the popup closes (e.g., reload the page or fetch session)
    //             console.log('Google sign-in popup closed');
    //             window.location.reload(); // You can also fetch user session here instead of reloading
    //         }
    //     }, 1000);
    // }

    return (
        <div className='text-white'>
            <div className="p-5 rounded-lg border-t-4 border-white-400 border">
                <h1 className="golden-ratio-2 font-bold my-4">Create Account</h1>
                <form className="flex flex-col gap-3" onSubmit={(e) => {register(e)}}>
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
                    {error && (
                        <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
                            {error}
                        </div>
                    )}
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
                    message="A verification email has been sent to you. Please verify your email address to view your dream interpretation. Thank you!"
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
