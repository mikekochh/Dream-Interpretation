"use client";
import PurchaseButton from './PurchaseButton';
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

const LandingPageForm = ({ }) => {

    const { data: session } = useSession();
    const [user, setUser] = useState({});

    useEffect(() => {
        const setUserData = async () => {
            console.log("Do we ever get here?");
            const email = session?.user?.email;
            if (email) {
                try {
                    const res = await fetch(`api/user/${email}`, { method: "GET", headers: { "Content-Type": "application/json" } });
                    const userData = await res.json();
                    setUser(userData);
                } catch (err) {
                    console.log('err:', err);
                }
            }
        };

        console.log("session: ", session);

        if (session) {
            setUserData();
        }
    }, [session]);

    return (
        <div className={`main-content text-white `}>
            <div className='loadingContainer'>
                <p className="text-center golden-ratio-4 gradient-title-text pb-2">The Leaders in Dream Interpretation</p>
                <p className="text-center golden-ratio-2 pb-10">Gain unlimited access to all of our dream interpretation AI models</p>
                {session ? (
                    <PurchaseButton buttonText={"Start Now"} user={user} />
                ) : (
                    <div>
                        <button className="disabled-button start-button" disabled>Start Now</button>
                        <p>Please finish creating an account to join our membership</p>
                        <p>Create an account link</p>
                        <p>Resend Email Verification</p>
                    </div>
                    
                )}
                
            </div>
        </div>
    )
}

export default LandingPageForm;