"use client"
import React from "react"
import { useRouter } from "next/navigation";

export default function PrivacyNoticeForm() { 

    const router = useRouter();

    function exit () {
        router.push('/home');
    }

    return (
    <div className="text-white text-center p-4">
        A short privacy notice just to let you know what I am doing with your data. For now, nothing. 
        I&apos;m collecting name, email, and password for account creation to prevent people from spamming 
        site. All passwords are encrypted. I will not be sending out any emails, as for now this is 
        just a test site to see if demand is here. Don&apos;t want to scare people off by sending them emails and annoying them. 
        So for now, I will not be sending out any emails. I will update this notice and make it evidently clear that I 
        might start sending out emails, and I will give you the option to not receive emails from me if this website 
        does well and I decide to do this in the future.<br/><br/>
        If you want consistent updates on the application, please follow me on X as that is where I am most active. If you have any questions, feel 
        free to reach out via DM on X or by Email at <a href="mailto:mkoch@michaelgkoch.com">mkoch@michaelgkoch.com</a><br/>
        Thank you again for using my site :)<br/><br/>
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