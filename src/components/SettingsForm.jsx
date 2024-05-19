"use client";
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import ContactAndPrivacyButtons from './ContactAndPrivacyButtons';

const SettingsForm = () => {
    const router = useRouter();
    const { data: session } = useSession();
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true); // New loading state

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
                setLoading(false); // Set loading to false after user data is loaded
            }).catch(err => {
                console.log('err: ', err);
                setLoading(false); // Set loading to false in case of error
            });
        } else {
            setLoading(false); // Set loading to false if no session
        }
    }, [session]);

    const logout = async () => {
        await signOut({ redirect: false });
        router.push("/interpret");
    }

    const subscription = async () => {
        window.location.href = '/cancelSubscription';
    }

    const createAccount = () => {
        router.push("/createAccount");
    }

    if (loading) {
        return (
            <div className="main-content text-white flex justify-center items-center h-screen">
                <div className='loadingContainer'>
                    <p className='loadingText'>Transporting to Dream Profile</p>
                    <div className='dotsContainer'>
                        <div className='dot delay200'></div>
                        <div className='dot delay400'></div>
                        <div className='dot'></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            {!session && (
                <div className="overlay-message w-full md:w-fit golden-ratio-3">
                    <p>Create an account to update profile</p>
                    <button className="create-account-button" onClick={createAccount}>Create Account</button>
                </div>
            )}
            <div className={`main-content golden-ratio-2 text-white ${!session && "blur-effect"}`}>
                <h1 className="text-white text-center golden-ratio-4 p-0">Profile</h1>
                <p className="font-bold golden-ratio-3 pl-4">{user.name}</p>
                <p className="pl-4">{user.email}</p>
                <div className="pl-4">
                    {user.dreamCount === 1 ? (
                        <p>1 dream journaled</p>
                    ) : user.dreamCount ? (
                        <p>{user.dreamCount} dream&apos;s journaled</p>
                    ) : (
                        <p>0 Dream&apos;s Journaled</p>
                    )}
                </div>
                <div className="logout absolute bottom-0 right-0 p-4">
                    <button onClick={logout} className="back-button">Log Out</button>
                    {/* {subscribed && <button onClick={subscription} className="dream-button">Cancel Subscription</button>} */}
                </div>
                <ContactAndPrivacyButtons />
            </div>
        </div>
    )
}

export default SettingsForm;
