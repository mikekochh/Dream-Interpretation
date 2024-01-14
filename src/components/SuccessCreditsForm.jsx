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
    const [emailSent, setEmailSent] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const verifyPayment = async () => {
            console.log("Verifying payment..."); 
            if (session && session_id && !isVerified) {
                try {
                    setIsVerified(true);
                    const res = await axios.post('/api/verifyPayment/credits', { session_id, userEmail: session.user.email });
                    if (res.status === 200) {
                        console.log("User credits successfully purchased and updated!");
                        return true;
                    }
                } catch (error) {
                    setError(error.response.data.message);
                    return false;
                }
            }
        }

        async function sendVerificationEmail() {
            try {
                const paymentVerified = await verifyPayment();
                console.log('paymentVerified: ', paymentVerified);
                console.log('session: ', session);
                console.log('emailSent: ', emailSent);
                if (session && !emailSent && paymentVerified) {
                    console.log('sending verification email...');
                    setEmailSent(true);
                    const email = session.user.email;
                    console.log('email: ', email);  
                    const res = await axios.post('/api/sendVerificationEmail', { email });
                    console.log('res: ', res);
                }
            } catch (error) {
                console.log('error: ', error);
            }
        }

        sendVerificationEmail();
    }, [session, session_id, isVerified]);
    

    return (
        <div className="main-content text-white text-center text-3xl pb-1">
            {error ? (
                <div>
                    <p className="text-red-500 pt-10">{error}</p>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-10" onClick={() => window.location.href = "/interpret"}>Return Home</button>
                </div>
                
            ) : (
                <p>Success! Your credits have been added to your account!</p>
            )}
            {emailSent && (
                <div className="text-xl pt-5">
                    We&apos;ve sent a verification email to the address of {session.user.email}<br/><br/>
                    If you do not see the email, please check your spam/junk folder.
                </div>
            )}
        </div>
    )
}