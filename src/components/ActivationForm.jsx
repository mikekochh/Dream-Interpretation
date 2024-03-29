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

    const activateUser = async function() {
        try {
            const res = await axios.post('api/activate', { verificationTokenID });
            router.push('/interpret');
        } catch (error) {
            setStatus("Error Activating User");
            setError(true);
        }
    }

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