"use client";
import { useSearchParams } from 'next/navigation'

export default function PasswordResetForm() {

    const searchParams = useSearchParams();
 
    const email = searchParams.get('email');

    return (
        <div className='text-white text-center'>
            <p className="text-3xl pt-10 text-center">
                We&apos;ve sent an email to the address of {email} to reset your password.<br/><br/>
                If you do not see the email, please check your spam/junk folder.
            </p>
            <div className="text-xl pt-5">
                Please click the link in the email to reset your password.
            </div>
        </div>
    )
}