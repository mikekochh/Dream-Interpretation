"use client"
import React from "react"
import { useRouter } from "next/navigation";

export default function PrivacyNoticeForm() { 

    const router = useRouter();

    function exit () {
        router.push('/settings');
    }

    return (
    <div className="text-white text-center p-4 main-content">
        At Dream Oracles, we are committed to protecting your privacy and ensuring the confidentiality of your information. 
        When you record your dreams in our application, please be assured that this information is stored anonymously and securely.
        We understand that dreams can be very personal and we want you to feel comfortable sharing them with us. <br/><br/>
        We collect your email address solely for specific marketing purposes. These include informing you about sales on
        our products, as well as updating you on new blogs and articles published on our platform. We respect your inbox and aim
        to send only relevant and valuable information. <br/><br/>

        If you want consistent updates on the application, and also cool content about dreams, please follow us on X/Twitter <a className="underline" href="https://twitter.com/Dream_Oracles">@Dream_Oracles</a>.
        Any questions, comments, or concerns can be left in the feedback section of the site, DM us on Twitter, or by emailing me at <a href="mailto:mkoch@michaelgkoch.com">mkoch@michaelgkoch.com</a>. Thank you again for using our site :)
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