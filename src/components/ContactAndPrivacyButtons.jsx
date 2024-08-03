"use client";
import React from "react";
import { useRouter } from "next/navigation";

const ContactAndPrivacyButtons = () => {

    const router = useRouter();

    const privacyNotice = () => {
        router.push("/privacyNotice");
    }

    const contactUs = () => {
        router.push("/contactMe");
    }

    return (
        <div className="text-white golden-ratio-2">
            <button className="underline p-1" onClick={privacyNotice}>View Our Privacy Notice</button><br/>
            <button className="underline p-1" onClick={contactUs}>Contact Us</button>
        </div>
    )
}

export default ContactAndPrivacyButtons;

