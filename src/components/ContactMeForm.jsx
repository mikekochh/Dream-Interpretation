"use client"
import React from "react"
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXTwitter, faYoutube } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';


export default function ContactMeForm() { 

    const router = useRouter();

    function exit () {
        router.push('/journal');
    }

    return (
    <div className="text-white text-center p-4">
        <a href="https://twitter.com/MichaelKochDev" className="p-4" target="_blank" rel="nonreferrer">
            <FontAwesomeIcon icon={faXTwitter} size="2x" />
        </a>
        <a href="mailto:mkoch@michaelgkoch.com" className="p-4" target="_blank" rel="nonreferrer">
            <FontAwesomeIcon icon={faEnvelope} size="2x" />
        </a>
        <a href="https://www.youtube.com/shorts/po8l4r0K6MY" className="p-4" target="_blank" rel="nonreferrer">
            <FontAwesomeIcon icon={faYoutube} size="2x" />
        </a>
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