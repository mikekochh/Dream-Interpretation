"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

const SettingsForm = () => {

    const router = useRouter();
    const { data: session } = useSession();
    const [user, setUser] = useState({});

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

        console.log('session: ', session);

        if (session) {
            setUserData().then(userData => {
                setUser(userData);
            }).catch(err => {
                console.log('err: ', err);
            });
        }
    }, [session]);

    const logout = async () => {
        await signOut({ redirect: false });
        router.push("/homePage");
    }

    const subscription = async () => {
        const userID = user._id;
        const subscribed = user.subscribed;
        const res = await axios.post('api/user/subscribe', { userID, subscribed });
    }
    
    console.log('user: ', user);

    return (
        <div className="main-content text-white">
            <h1 className="text-3xl text-white text-center">Settings</h1>
            <p>Email: {user.email}</p>
            <p>Name: {user.name}</p>
            <div className="logout absolute bottom-0 left-0 p-4">
                <button onClick={logout} className="text-sm mt-3 text-right bg-red-700 p-2 rounded-lg">Log Out</button>
                <button onClick={subscription} className="text-sm mt-3 text-right bg-blue-500 text-white p-2 rounded-lg">Subscription</button>
            </div>
        </div>
    )

}

export default SettingsForm;

