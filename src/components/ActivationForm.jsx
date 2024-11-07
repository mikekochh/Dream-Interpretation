"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { signIn } from "next-auth/react";
import LoadingComponent from './LoadingComponent';

export default function ActivationForm() { 

    const searchParams = useSearchParams();
    const verificationTokenID = searchParams.get('verificationTokenID');
    const router = useRouter();
    const [status, setStatus] = useState("");
    const [error, setError] = useState(false);
    const [userName, setUserName] = useState(null);
    const [userEmail, setUserEmail] = useState(null);

    const activateUser = async function() {
        try {
            const res = await axios.post('api/activate', { verificationTokenID });

            setUserName(res.data.activatedUser.name);
            setUserEmail(res.data.activatedUser.email);
            const dreamID = localStorage.getItem('dreamID');
            const ebook = localStorage.getItem('ebook');
            // if (dreamID)
            if (true) {
                setStatus("Successfully Activated! Redirecting you now...");
                router.push('/interpret');
                localStorage.removeItem('dreamID');
                const resSignIn = await signIn("credentials", {
                    email: res.data.activatedUser.email,
                    password: 'password',
                    redirect: false
                });
            } else if (ebook) {
                setStatus("Downloading Dream Interpretation E-book");
                const resSignIn = await signIn("credentials", {
                    email: res.data.activatedUser.email,
                    password: 'password',
                    redirect: false
                });
                localStorage.removeItem('ebook');
                router.push('/e-book');
            }
            else {
                setStatus("Successfully Activated! Redirecting you now...");
                const resSignIn = await signIn("credentials", {
                    email: res.data.activatedUser.email,
                    password: 'password',
                    redirect: false
                });
                router.push('/settings');
            }
        } catch (error) {
            setStatus("Error Activating User");
            setError(true);
        }
    }

    useEffect(() => {
        const sendWelcomeEmail = async function() {
            try {
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
        if (verificationTokenID) {
            activateUser();
        }
    }, [verificationTokenID]);

    return (
        <div className="text-white text-3xl text-center p-4">
            <LoadingComponent loadingText={status} />
            {error && <div className="text-red-500 w-2/3">You might have clicked an old activation email. If you continue to have issues, please contact for support.</div> }
        </div>
    )
}