"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import ContactAndPrivacyButtons from './ContactAndPrivacyButtons';

export default function UpdatePasswordForm() { 

    const searchParams = useSearchParams();
    const verificationTokenID = searchParams.get('verificationTokenID');
    const router = useRouter();
    const [updatePassword, setUpdatePassword] = useState(false);
    const [error, setError] = useState(false);
    const [password, setPassword] = useState("");

    const checkToken = async function() {
        try {
            const res = await axios.get('api/checkToken/' + verificationTokenID);
            if (res.status === 200) {
                setUpdatePassword(true);
            }
        }
        catch (error) {
            setError(true);
            console.log('error: ', error);
        }
    }

    useEffect(() => {
        checkToken();
    });

    const submitPassword = async function(e) {
        e.preventDefault();
        try {
            const res = await axios.post('api/updatePassword', { verificationTokenID, password });
            router.push('/userLogin');
        } catch (error) {
            console.log('error: ', error);
        }
    }
    

    return (
        <div>
            {updatePassword && 
                <div className='text-white grid place-items-center h-screen z-0'>
                    <div className="p-5 rounded-lg border-t-4 border-white-400 border">
                        <h1 className="text-xl font-bold my-4">Reset Password Below</h1>
                        <form className="flex flex-col gap-3" onSubmit={submitPassword}>
                            <input type="password" placeholder="Password" className="LoginInput rounded-lg text-black" onChange={(e) => setPassword(e.target.value)} />
                            <button className="bg-blue-500 rounded-lg py-2 text-white font-bold text-center" onClick={submitPassword}>Update Password</button>
                        </form>
                    </div>
                </div>
            }
            {error && 
                <div className="text-white text-3xl text-center p-4">There was a problem with your password reset link. Please try again or contact support team.</div>
            }
            <ContactAndPrivacyButtons />
        </div>
        
        
    )
}