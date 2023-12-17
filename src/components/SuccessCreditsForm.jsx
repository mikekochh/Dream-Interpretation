"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';

export default function SuccessCreditsForm() { 

    const searchParams = useSearchParams();
    const session_id = searchParams.get('session_id');
    const { data: session } = useSession();
    const [isVerified, setIsVerified] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const verifyPayment = async () => {
            if (session && session_id && !isVerified) {
                try {
                    setIsVerified(true);
                    const res = await axios.post('/api/verifyPayment/credits', { session_id, userEmail: session.user.email });
                    console.log("res: ", res);
                    if (res.status === 200) {
                        console.log("User credits successfully purchased and updated!");
                        setTimeout(() => {
                            window.location.href = "/journal";
                        }, 1500);
                    }
                } catch (error) {
                    setError(error.response.data.message);
                }
            }
        }

        verifyPayment();
    }, [session, session_id, isVerified]);
    

    return (
        <div className="main-content text-white text-center text-3xl pb-1">
            {error ? (
                <div>
                    <p className="text-red-500 pt-10">Error: {error}</p>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-10" onClick={() => window.location.href = "/journal"}>Return Home</button>
                </div>
                
            ) : (
                <p>Success! Your credits have been added to your account! Redirecting to home screen...</p>
            )}
        </div>
    )
}