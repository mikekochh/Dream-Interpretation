"use client";
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { useState, useEffect } from 'react';

export default function EmailVerificationForm() {

    const searchParams = useSearchParams();
 
    const email = searchParams.get('email');
    const [emailSent, setEmailSent] = useState(false);

    useEffect(() => {
        async function sendVerificationEmail() {
            try {
                setEmailSent(true);
                const res = await axios.post('api/sendVerificationEmail', { email });
            } catch (error) {
                console.log('error: ', error);
            }
        }

        if (email && !emailSent) {
            sendVerificationEmail();
        }
    }, [email]);

    return (
        <div className='text-white text-center main-content'>
            <p className="text-3xl pt-10 text-center">
                We&apos;ve sent a verification email to the address of {email}<br/><br/>
                If you do not see the email, please check your spam/junk folder.
            </p>
            <div className="text-xl pt-5">
                Please click the link in the email to verify your account.
            </div>
        </div>
    )
}