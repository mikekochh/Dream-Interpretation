"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';

export default function ActivationForm() { 

    const searchParams = useSearchParams();
    const verificationTokenID = searchParams.get('verificationTokenID');
    const router = useRouter();
    const [status, setStatus] = useState("Successfully Activated! Redirecting you now...");
    const [error, setError] = useState(false);
    const [userName, setUserName] = useState(null);
    const [userEmail, setUserEmail] = useState(null);

    const activateUser = async function() {
        try {
            const res = await axios.post('api/activate', { verificationTokenID });

            setUserName(res.data.activatedUser.name);
            setUserEmail(res.data.activatedUser.email)

            router.push('/settings');
        } catch (error) {
            setStatus("Error Activating User");
            setError(true);
        }
    }

    useEffect(() => {
        const sendWelcomeEmail = async function() {
            try {
                console.log("sending welcome email!");
                console.log("userEmail: ", userEmail);
                console.log("userName: ", userName);
                const resWelcomeEmail = await axios.post('/api/user/sendWelcomeEmail', {
                    email: userEmail,
                    name: userName
                })
            } catch (error) {
                console.log("Error sending welcome email");
            }
        }

        if (userEmail && userName) {
            sendWelcomeEmail();
        }
    }, [userEmail, userName])

    useEffect(() => {
        activateUser();
    });

    return (
        <div className="text-white text-3xl text-center p-4 main-content">
            {status}
            {error && <div className="text-red-500">You might have clicked an old activation email. If you continue to have issues, please contact for support.</div> }
        </div>
    )
}