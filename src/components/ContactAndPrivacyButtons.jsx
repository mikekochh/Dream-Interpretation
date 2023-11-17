"use client";
import React from "react";
import { useRouter } from "next/navigation";

const ContactAndPrivacyButtons = () => {

    const router = useRouter();

    const privacyNotice = () => {
        router.push("/privacyNotice");
    }

    const contactMe = () => {
        router.push("/contactMe");
    }

    return (
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-white text-center">
            <button className="underline p-1" onClick={privacyNotice}>Privacy Notice</button>
            <button className="underline p-1" onClick={contactMe}>Contact Me</button>
        </div>
    )
}

export default ContactAndPrivacyButtons;

