"use client"
import React from "react"
import { useRouter } from "next/navigation";

export default function PrivacyNoticeForm() { 

    const router = useRouter();

    function exit () {
        router.push('/settings');
    }

    return (
    <div className="text-white p-4 main-content pb-10">
        <p className="golden-ratio-3 font-bold text-center pb-2">Privacy Notice for Dream Oracles</p>
        <p className="golden-ratio-1">
            At Dream Oracles, we are committed to protecting your privacy and ensuring
            the confidentiality of your information. When you record your dreams in 
            our application, please be assured that this information is stored securely. 
            We understand that dreams can be very personal, and we want you to feel 
            comfortable sharing them with us.
        </p>
        <p className="golden-ratio-2 font-bold pt-3">Information Collection and Use</p>
        <p className="golden-ratio-1 font-bold pt-2">Dream Entries</p>
        <p className="golden-ratio-1">
            Your dream entries and interpretation are stored securely within our application.
            We take every precaution to ensure this data remains private and is only accessible
            by you.
        </p>
        <p className="golden-ratio-1 font-bold pt-2">Email Address</p>
        <p className="golden-ratio-1">
            We collect your email address solely for the following purposes:< br/>
            • Account Creation: To create and manage your account within our application.< br/>
            • Verification: To verify that your email address is valid and belongs to you.< br/>
            < br/>
            We do not use your email address for marketing purposes or share it with 
            third parties for any reason.
        </p>
        <p className="golden-ratio-2 font-bold pt-3">Data Security</p>
        <p className="golden-ratio-1">
            We implement a variety of security measures to maintain the safety of your personal
            information when you enter, submit, or access your personal data. 
        </p>
        <p className="golden-ratio-2 font-bold pt-3">Communication</p>
        <p className="golden-ratio-1">
            If you want consistent updates on the application and cool content about dreams,
            please follow us on our social media platforms:< br/>
            • X (Twitter): @Dream_Oracles< br/>
            • Instagram: @dreamoracles< br/>
            • Tik Tok: @dreamoracles< br/>
            • YouTube: @dreamoracles< br/>
        </p>
        <p className="golden-ratio-2 font-bold pt-3">Contact Us</p>
        <p className="golden-ratio-1">
            For any questions, comments, concerns, feedback, or feature requests, please:< br/>
            • Leave feedback in the feedback section of the site< br/>
            • Direct message us on any of the social media platforms mentioned above< br/>
            • Email us at mkoch@michaelgkoch.com< br/>
        </p>
        <div className="text-center">
            <p className="golden-ratio-1 pt-3">
                Thank you again for using our site and trusting us with your dreams.
                Your privacy and trust are of utomst importance to us.
            </p>
            <p className="golden-ratio-1">Effective Date: 1/1/2024</p>
            <p className="golden-ratio-1">Last Updated: 5/14/2024</p>
        </div>
        <div>
            </div>
            <div className="absolute bottom-0 right-0">
                <button onClick={exit} className="bg-white rounded-xl p-2 text-black m-2">
                    Return
                </button>
            </div>
        </div>
    )

}