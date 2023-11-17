"use client"
import React from "react"
import { useRouter } from "next/navigation";

export default function ContactMeForm() { 

    const router = useRouter();

    function exit () {
        router.push('/home');
    }

    return (
    <div className="text-white text-center p-4">
        You can contaact me at <a href="mailto:mkoch@michaelgkoch.com">mkoch@michaelgkoch.com</a> or 
        you can follow me on X at <a href="https://twitter.com/MichaelKochDev">@MichaelKochDev</a>
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