"use client"
import React from "react"
import { useRouter } from "next/navigation";

export default function PrivacyNoticeForm() { 

    const router = useRouter();

    function exit () {
        router.push('/journal');
    }

    return (
    <div className="text-white text-center p-4">
        A short, unprofessional privacy notice to let you know what I am doing with your data.
        I&apos;m collecting name, email, and password for account creation to prevent people from spamming
        the site. All passwords are encrypted. <b>I will not be sending out any emails.</b> For now, this is just
        a test site to see what the demand is. Don&apos;t want to scare people off by sending them emails.<br /><br />
        
        If you want consistent updates on the application, and also cool content, please follow on X <a href="https://twitter.com/MichaelKochDev">@MichaelKochDev</a>.
        If you have any questions, feel free to reach out via DM on X or by Email at <a href="mailto:mkoch@michaelgkoch.com">mkoch@michaelgkoch.com</a>. Thank you again for using my site :)
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