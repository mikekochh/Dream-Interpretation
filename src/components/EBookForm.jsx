"use client";
import { useState } from 'react';
import axios from 'axios';
import { SIGN_UP_TYPE_E_BOOK } from "@/types/signUpTypes";

export default function EBookForm() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
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

            const responseRegister = await axios.post('api/register', {
                name,
                email,
                signUpTypeID: SIGN_UP_TYPE_E_BOOK 
            });
        } catch (error) {
            console.log("There was an error signing user up for the ebook: ", error);
            setError("Oops! Something went wrong while processing your request. Please try again in a few moments.");
        }
    };    

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 p-6 bg-gray-800 rounded-lg shadow-lg">
                {!submitted ? (
                    <>
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
                                    Download Ebook
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-white">
                            Thank you for signing up!
                        </h2>
                        <p className="text-gray-400 mt-4">
                            Please check your email for the download link to the ebook.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}