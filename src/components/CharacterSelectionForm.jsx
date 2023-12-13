"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function OracleSelectionForm() {

    const [oracles, setOracles] = useState([]);
    const [selectedOracle, setSelectedOracle] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    const { data: session } = useSession();

    const router = useRouter();

    useEffect(() => {
        async function getOracles() {
            const res = await axios.get('/api/oracles');
            setOracles(res.data);
        }
        getOracles();
    }, []);

    useEffect(() => {
        async function getUser() {
            const email = session?.user?.email;
            if (email) {
                const res = await fetch(`api/user/${email}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                return res.json();
            }
            return null;
        }

        if (session) {
            getUser().then(userData => {
                if (userData?.oracleID) {
                    setSelectedOracle(userData.oracleID);
                }
                else {
                }
                
            }).catch(err => {
                console.log('err: ', err);
            });
        }
    }, [session]);

    const handleOracleClick = (oracle) => {
        setSelectedOracle(oracle.oracleID);
    }

    return (
        <div>
            <div className="text-white text-center text-xl main-content">Meet the Oracles!</div>
            <div className="grid grid-cols-5 gap-4 mr-2 ml-2">
                {oracles.map((oracle, index) => {

                    const isSelected = selectedOracle === oracle.oracleID;
 
                    return (
                        <div key={index} className={`text-white text-center flex flex-col items-center justify-center rounded-xl`}>
                            <input type="radio" id={oracle.oracleName} name="oracle" value={oracle.oracleID} checked={isSelected} onChange={() => {}} style={{ display: 'none'}} />
                            {/* Good oracles for desktop */}
                            <div className="hidden sm:block sm:flex-col">
                                <div className="flex justify-center items-center">
                                    <Image 
                                        width={300} 
                                        height={300} 
                                        src={oracle.oraclePicture} 
                                        alt={oracle.oracleName} 
                                        className={`rounded-xl text-center cursor-pointer ${isSelected ? 'border-4 border-blue-500' : ''}`} 
                                        onClick={() => handleOracleClick(oracle)}
                                    />
                                </div>
                                <label htmlFor={oracle.name} className={`${isSelected ? 'font-bold md:text-sm' : ''}`}>{oracle.oracleName}</label>
                            </div>

                            {/* oracles for mobile */}
                            <div className="sm:hidden justify-center items-center flex">
                                <Image 
                                    width={125} 
                                    height={125} 
                                    src={oracle.oraclePicture} 
                                    alt={oracle.oracleName} 
                                    className={`rounded-xl text-center cursor-pointer ${isSelected ? 'border-4 border-blue-500' : ''}`} 
                                    onClick={() => handleOracleClick(oracle)}
                                />
                                <label htmlFor={oracle.name} className={`block text-center ml-2 ${isSelected ? 'font-bold md:text-sm' : ''}`} style={{maxWidth: '300px'}}>{oracle.oracleName}</label>
                            </div>
                        </div>
                    )
                })}
            </div>
            <div className="flex justify-center flex-col items-center">
                <div className="fixed bottom-0 mb-6">
                </div>
                {errorMessage && <div className="bg-red-600 text-white w-fit text-sm py-1 px-3 rounded-md mt-2 font-bold">{errorMessage}</div>}
            </div>
        </div>
    )
}

const OracleDetailsPopup = (oracleName, oracleDescription) => {

    return (
        <div className="flex justify-center text-3xl pt-5">
            <Popup 
                trigger={<button><FontAwesomeIcon icon={faInfoCircle} className="ml-2"/></button>} 
                position="top center"
                contentStyle={{width: "50%"}}
            >
                <b>Response Type</b><br/>
                Our oracles by default will give you a longer, more detailed, and more educational interpretation.
                If you would like a shorter, straight to the point answer, or the ability to ask a followup
                question, select short. We recommend getting the full answer as a beginner, and then switching
                to short answers once you are familiar with dream concepts.
            </Popup>
        </div>
    )
}