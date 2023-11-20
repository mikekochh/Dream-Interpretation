"use client";
import ContactAndPrivacyButtons from "./ContactAndPrivacyButtons";
import { useSearchParams } from 'next/navigation'

export default function EmailVerificationForm() {

    const searchParams = useSearchParams();
 
    const email = searchParams.get('email');

    return (
        <div className='text-white text-center'>
            <p className="text-3xl pt-10 text-center">We&apos;ve sent a verification email to the address of {email}</p>
            
            <div className="text-xl pt-5">
                Please click the link in the email to verify your account.
            </div>
        </div>
    )
}