"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function CancelSubscriptionForm() { 

    const { data: session } = useSession();
    const [user, setUser] = useState({});
    const router = useRouter();

    useEffect(() => {
        async function setUserData() {
            const email = session?.user?.email;
            const res = await fetch(`api/user/${email}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            return res.json();
        }

        if (session) {
            setUserData().then(userData => {
                setUser(userData);
            }).catch(err => {
                console.log('err: ', err);
            });
        }
    }, [session]);

    const cancelSubscription = async function() {
        try {
            const userID = user._id;
            const subscriptionID = user.subscriptionID;
            const res = await axios.post('api/user/cancelSubscription', { userID, subscriptionID });
            router.push('/journal');
        } catch (error) {
            console.log('error: ', error);
        }
    }

    return (
        <div className="text-white text-xl text-center p-4 main-content">
            <h1 className="text-3xl pb-5">Cancel Subscription</h1>
            <p>We're sad to see you go :(</p>
            <p className="pb-5">Would you mind telling us a bit about why you are deciding to cancel? Any feedback about the website would also be greatly appreciated, thank you!</p>
            <textarea className="w-full h-32 p-2 rounded-lg DreamBox" rows={20} placeholder="Canceling Reason"></textarea>
            <textarea className="w-full h-32 p-2 rounded-lg DreamBox" rows={20} placeholder="Feedback"></textarea>
            <button className="bg-red-600 hover:bg-red-500 font-bold py-2 px-4 rounded mt-10 text-black" onClick={cancelSubscription}>Cancel Subscription</button>
        </div>
    )
}