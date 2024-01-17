"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';

export default function SuccessTelegramForm() {

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
                    const res = await axios.post('/api/verifyPayment/telegram', { session_id, userEmail: session.user.email });
                    setIsVerified(true);
                    if (res.status === 200) {
                        setTimeout(() => {
                            window.location.href = "/interpret";
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
                const res = await axios.post('/api/sendTelegramInvite', { email: session.user.email });
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

    }, [isVerified, sentEmail, session]);

    return (
        <div className="main-content text-white text-center text-3xl pb-1">
            <p>Success! You will be receiving an email from us shortly with the telegram community invite.</p>
            <p>Redirecting to home screen...</p>
        </div>
    )
 }