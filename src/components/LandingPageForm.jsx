"use client";
import PurchaseButton from './PurchaseButton';
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

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
        console.log("user: ", user);

        if (session) {
            setUserData();
        }
    }, [session]);

    return (
        <div className='main-content text-white '>
            <div>
                <p className="text-center golden-ratio-4 gradient-title-text pb-2 md:w-2/3 mx-auto">The Leaders in Dream Interpretation</p>
                {user?.activated ? (
                    <div>
                        <div className="flex justify-center">
                            <PurchaseButton buttonText={"Start Now"} user={user} />
                        </div>
                        <div className="mt-8 space-y-20 w-11/12 mx-auto">
                            <div className="flex flex-col md:flex-row items-center md:items-center">
                                <div className="w-full md:w-1/3 md:text-left">
                                    <h3 className="golden-ratio-3 font-bold">Unlimited Interpretations</h3>
                                    <p className="golden-ratio-2">Gain unlimited access to all of our dream interpretation AI models</p>
                                    <PurchaseButton buttonText={"Start Now"} user={user} />
                                </div>
                            </div>
                            <div className="flex flex-col md:flex-row items-center md:items-start md:flex-row-reverse">
                                <div className="w-full md:w-2/3 md:text-right">
                                    <h3 className="golden-ratio-3 font-bold">Intelligent Dream Oracles</h3>
                                    <p className="golden-ratio-2">Select from our ever-growing list of 5+ Dream Oracles, each offering a unique perspective on your dreams.</p>
                                </div>
                                <div className="w-full md:w-1/3 flex justify-center">
                                    <PurchaseButton buttonText={"Start Now"} user={user} />
                                </div>
                            </div>
                            <div className="flex flex-col md:flex-row items-center md:items-start">
                                <div className="w-full md:w-2/3 md:text-left">
                                    <h3 className="golden-ratio-3 font-bold">Intuitive Dream Journal</h3>
                                    <p className="golden-ratio-2">All of your dreams, interpretations, and notes securely stored in your personal dream journal</p>
                                </div>
                                <div className="w-full md:w-1/3 flex justify-center">
                                    <PurchaseButton buttonText={"Start Now"} user={user} />
                                </div>
                            </div>
                            <div className="flex flex-col md:flex-row items-center md:items-start md:flex-row-reverse">
                                <div className="w-full md:w-2/3 md:text-right">
                                    <h3 className="golden-ratio-3 font-bold">Mood Recording</h3>
                                    <p className="golden-ratio-2">Capture the emotions you experienced during your dreams, and incorporate them into the interpretation for deeper insights.</p>
                                </div>
                                <div className="w-full md:w-1/3 flex justify-center">
                                    <PurchaseButton buttonText={"Start Now"} user={user} />
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center">
                        <button className="disabled-button start-button" disabled>Start Now</button>
                        <p className="text-gold golden-ratio-1">Please finish creating an account to start a membership</p>
                        {user?.email ? (
                            <div>
                                <Link className="text-gold golden-ratio-1 underline" href="/sendEmailVerification">Didn`&apos;t Receive Verification Email?</Link>
                            </div>
                        ) : (
                            <div>
                                <Link className="text-gold golden-ratio-1 underline" href="/register">Create an account here</Link>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default LandingPageForm;