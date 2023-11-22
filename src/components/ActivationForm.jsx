"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import ContactAndPrivacyButtons from './ContactAndPrivacyButtons';

export default function ActivationForm() { 

    const searchParams = useSearchParams();
    const verificationTokenID = searchParams.get('verificationTokenID');
    const router = useRouter();
    const [status, setStatus] = useState("Successfully Activated! Redirecting you now...");
    const [error, setError] = useState(false);

    const activateUser = async function() {
        try {
            const res = await axios.post('api/activate', { verificationTokenID });
            router.push('/userLogin');
        } catch (error) {
            setStatus("Error Activating User");
            setError(true);
            console.log('error: ', error);
        }
    }
    

    useEffect(() => {
        activateUser();
    });

    return (
        <div className="text-white text-3xl text-center p-4">
            {status}
            {error && <div className="text-red-500">You might have clicked an old activation email. If you continue to have issues, please contact for support.</div> }
            <ContactAndPrivacyButtons />
        </div>
    )
}