"use client";
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { SIGN_UP_TYPE_E_BOOK } from "@/types/signUpTypes";
import { signIn } from 'next-auth/react';
import { UserContext } from '@/context/UserContext';

export default function EBookForm() {

    const { user, setUserData } = useContext(UserContext) || {};

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showSentEmailMessage, setShowSentEmailMessage] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            setError(""); // Clear any previous errors
    
            // Email validation regex
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
            if (!name) {
                setError("Please enter a name.");
                return;
            }
            if (!email) {
                setError("Please enter an email.");
                return;
            }
            if (!emailPattern.test(email)) {
                setError("Please enter a valid email address.");
                return;
            }

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
                        const resSignIn = await signIn("credentials", {
                            email,
                            password: 'password',
                            redirect: false
                        });
                        setUserData();
                        return;
                    }
                    else {
                        await axios.post('/api/sendEBookEmail', { email, name });
                        setShowSentEmailMessage(true);
                        localStorage.setItem('ebook', true);
                        return;
                    }
                }
            } else {
                const responseRegister = await axios.post('api/register', {
                    name,
                    email,
                    signUpTypeID: SIGN_UP_TYPE_E_BOOK 
                });
    
                if (responseRegister.status === 200) {
                    await axios.post('/api/sendEBookEmail', { email, name });
                    setShowSentEmailMessage(true);
                    localStorage.setItem('ebook', true);
                }
            }
            setLoading(false);
        } catch (error) {
            console.log("There was an error signing user up for the ebook: ", error);
            setError("Oops! Something went wrong while processing your request. Please try again in a few moments.");
            setLoading(false);
        }
    };    

    if (user) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-transparent text-white">
              E-Book
            </div>
        );          
    }

    if (showSentEmailMessage) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-transparent text-white text-center md:w-2/3 md:mx-auto">
                <div className="space-y-4">
                    <p className="text-4xl font-bold">Thank You! Check Your Email</p>
                    <p className="text-lg">We&apos;ve just sent an email to you with a link to download your free dream interpretation e-book!</p>
                    <p className="text-lg">Be sure to check your inbox (and your spam or promotions folder, just in case). If you don&apos;t see it, feel free to reach out for help. Enjoy exploring the world of dreams!</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 p-6 bg-gray-800 rounded-lg shadow-lg">
                <h1 className="text-3xl font-extrabold text-white text-center">
                    Get Your Free Dream Interpretation Ebook
                </h1>
                <p className="mt-2 text-gray-400 text-center">
                    Enter your email below to receive a free copy of our dream interpretation guide, packed with insights and knowledge to help you understand your dreams.
                </p>
                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div className="rounded-md shadow-sm space-y-4">
                        <div>
                            <label htmlFor="name" className="sr-only">Name</label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                placeholder="Your Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="sr-only">Email</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Your Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                    </div>
                    {error && (
                        <div className="text-sm text-red-600">
                            {error}
                        </div>
                    )}
                    <div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            {loading ? 'Loading...' : 'Download Ebook'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}