"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import LoadingComponent from './LoadingComponent';

export default function SuccessSubscriptionForm() { 

    const searchParams = useSearchParams();
    const session_id = searchParams.get('session_id');
    const { data: session } = useSession();
    const [isVerified, setIsVerified] = useState(false);
    const [error, setError] = useState(null);
    const [sentEmail, setSentEmail] = useState(false);

    useEffect(() => {
        const verifyPayment = async () => {
            if (session && session_id && !isVerified) {
                try {
                    const res = await axios.post('/api/verifyPayment/subscription', { session_id, userEmail: session.user.email });
                    setIsVerified(true);
                    if (res.status === 200) {
                        setTimeout(() => {
                            window.location.href = "/settings";
                        }, 1500);
                    }
                } catch (error) {
                    setError(error.response.data.message);
                }
            }
        }

        verifyPayment();
    }, [session, session_id, isVerified]);

    useEffect(() => {
        const sendEmailInvite = async () => {
            try {
                const res = await axios.post('/api/sendSubscriptionEmail', { email: session.user.email });
                if (res.status === 200) {
                    setSentEmail(true);
                }
            } catch (error) {
                setError(error.response.data.message);
            }
        }

        if (isVerified && session.user.email && !sentEmail) {
            sendEmailInvite();
        }
    }, [isVerified, session]);
    

    return (
        <div className="main-content text-white text-center golden-ratio-3 pb-1">
            {error ? (
                <div>
                    <p className="text-red-500 pt-10">Error: {error}</p>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-10" onClick={() => window.location.href = "/interpret"}>Return Home</button>
                </div>
            ) : (
                <div className="space-y-3 w-3/4 mx-auto">
                    <p>Congratulations! You are now subscribed to Dream Oracles!</p>
                    <p className="golden-ratio-2">Redirecting you to profile page to update profile details</p>
                    <LoadingComponent loadingText={"Redirecting"} altScreen={true} />
                </div>
                
            )}
        </div>
    )
}