"use client";
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import LoadingComponent from './LoadingComponent';

const PurchaseSubscriptionRedirect = () => {

    const { data: session } = useSession();
    const [user, setUser] = useState({});
    
    useEffect(() => {
        const setUserData = async () => {
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

        if (session) {
            setUserData();
        }
    }, [session]);

    useEffect(() => {
        const purchaseSubscription = async () => {
            const res = await axios.post("/api/user/purchase", {
                userID: user._id,
                paymentTypeID: 5,
                quantity: 1
            });
            if (res.status === 200) {
                window.location.href = res.data.sessionID;
            }
            else {
                console.log("purchase failure");
            }
        }

        if (user?._id) {
            purchaseSubscription();
        }
    }, [user])



    return (
        <div className="text-white">
            <LoadingComponent loadingText={"Setting Up Subscription"}/>
        </div>
    )
}

export default PurchaseSubscriptionRedirect;