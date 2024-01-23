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
    const [subscribed, setSubscribed] = useState(false);
    // const [oracleUpdated, setOracleUpdated] = useState(false);
    // const [metaAnalysisOracleID, setMetaAnalysisOracleID] = useState(0);

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
                setSubscribed(userData.subscribed);
                setMetaAnalysisOracleID(userData.metaAnalysisOracleID);
            }).catch(err => {
                console.log('err: ', err);
            });
        }
    }, [session]);

    const logout = async () => {
        await signOut({ redirect: false });
        router.push("/createAccount");
    }

    const subscription = async () => {
        window.location.href = '/cancelSubscription';
    }

    // const updateMetaAnalysisOracleID = async (oracleID) => {
    //     const res = await axios.post('/api/user/updateMetaAnalysisOracleID', {
    //         oracleID,
    //         userID: user._id
    //     });
    //     setMetaAnalysisOracleID(oracleID);
    //     setOracleUpdated(true);
    // }

    return (
        <div className="main-content text-white">
            <h1 className="text-3xl text-white text-center golden-ratio-4">Settings</h1>
            <p className="text-xl font-bold">Email: <span className="text-md font-normal">{user.email}</span></p>
            <p className="text-xl font-bold">Name: <span className="text-md font-normal">{user.name}</span></p>
            {/* <div className="flex items-center">
                <span className="text-xl font-bold mr-4">Meta Analysis Oracle: </span>
                <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                        Carl Jung:
                        <input 
                            type="radio" 
                            name="option" 
                            value={1} 
                            checked={metaAnalysisOracleID === 1} 
                            onChange={() => updateMetaAnalysisOracleID(1)}
                            className="form-rad"
                        />
                    </label>
                    <label className="flex items-center">
                        Sigmund Freud:
                        <input 
                            type="radio" 
                            name="option" 
                            value={2} 
                            checked={metaAnalysisOracleID === 2}
                            onChange={() => updateMetaAnalysisOracleID(2)}
                        />
                    </label>
                    <label className="flex items-center">
                        Ruya:
                        <input 
                            type="radio" 
                            name="option" 
                            value={3} 
                            checked={metaAnalysisOracleID === 3}
                            onChange={() => updateMetaAnalysisOracleID(3)}
                        />
                    </label>
                </div>
                {oracleUpdated && <p className="text-green-500">Oracle updated!</p>}
            </div> */}
            <div className="logout absolute bottom-0 right-0 p-4">
                <button onClick={logout} className="back-button">Log Out</button>
                {subscribed && <button onClick={subscription} className="dream-button">Cancel Subscription</button>}
            </div>
            <ContactAndPrivacyButtons />
        </div>
    )

}

export default SettingsForm;

