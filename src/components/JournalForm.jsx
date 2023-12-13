"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { signOut } from "next-auth/react";
import { useSession } from 'next-auth/react';
import 'reactjs-popup/dist/index.css';
import Popup from 'reactjs-popup';
import ContactAndPrivacyButtons from "./ContactAndPrivacyButtons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import { set } from 'mongoose';

export default function JournalForm() { 

    const { data: session } = useSession();
    const [user, setUser] = useState(null);
    const [error, setError] = useState(false);
    const [savingDream, setSavingDream] = useState(false);
    const [oracles, setOracles] = useState([]);
    const [buttonText, setButtonText] = useState("Journal Dream");
    const [selectedOracles, setSelectedOracles] = useState({});
    const [short, setShort] = useState(true);
    const [newDreamID, setNewDreamID] = useState(null);

    useEffect(() => {

        if (Object.keys(selectedOracles).length) {
            let anyChecked = false;
            for (let oracleSelected in selectedOracles) {
                if (selectedOracles[oracleSelected]) {
                    anyChecked = true;
                }
            }
            setButtonText(anyChecked ? "Journal Dream and Interpret" : "Journal Dream");
        }
        else {
            setButtonText("Journal Dream");
        }

    }, [selectedOracles]);

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


    useEffect(() => {
        async function getOracles() {
            const res = await axios.get('/api/oracles');
            setOracles(res.data);
        }

        getOracles();
    }, []);

    function handleSelectionChange(oracleID) {
        setSelectedOracles(prev => ({
            ...prev,
            [oracleID]: !prev[oracleID]
        }));
    }

    async function journalDream() {
        var dream = document.querySelector('.DreamBox').value;
        if (!dream) {
            setError("Please enter a dream");
            return;
        }
        setSavingDream(true);
        const userID = user._id;
        let interpretDream = false;
        if (Object.keys(selectedOracles).length) {
            for (let oracleSelected in selectedOracles) {
                if (selectedOracles[oracleSelected]) {
                    interpretDream = true;
                }
            }
        }
        try {
            const resJournal = await axios.post('/api/dream/journal', { userID, dream, interpretDream });
            console.log('resJournal: ', resJournal.data._id);
            setNewDreamID(resJournal.data._id);
            if (interpretDream) {
                const dreamID = resJournal.data._id;
                for (let oracleSelected in selectedOracles) {
                    if (selectedOracles[oracleSelected]) {
                        const resInterpret = await axios.post('/api/dream/interpret', 
                        { 
                            dreamID, 
                            dream, 
                            oracleID: oracleSelected, 
                            user,
                            short
                        });
                    }
                }
            }
        }
        catch (error) {
            setError("Error Journaling Dream");
        }   
    }

    const resetPage = () => {
        setSavingDream(false);
        setSelectedOracles({});
        setError('');
    }

    const goToDreamDetails = () => {
        window.location.href = `/dreamDetails?dreamID=${newDreamID}`;
    }

    const handleCheckboxChange = (event) => {
        setShort(event.target.checked);
    };

    return (
        <div className="text-white main-content relative">
            {savingDream ? (
                <div className="flex justify-center items-center middle-content">
                    <div className="flex justify-center items-center flex-col">
                        <p className="text-center text-2xl p-4">
                            You&apos;re dream has been saved and is currently being interpreted. Interpretation will appear under the dream details.
                        </p>
                        <div className="flex justify-center">
                            <button className="rounded-xl bg-blue-600 p-2 m-2 pl-4 pr-4 justify-center item" onClick={resetPage}>Journal New Dream</button>
                            <button className="rounded-xl bg-blue-600 p-2 m-2 pl-4 pr-4 justify-center item" onClick={goToDreamDetails}>Go To Dream Details</button>
                        </div>  
                    </div>
                </div>
            ) : (
                <div>
                <div className="absolute right-0 top-0 p-2 main-content">Dream Credits: {user?.credits}</div>
                    <button className="rounded-xl bg-blue-600 p-2 m-2" onClick={journalDream}>{buttonText}</button>
                    <div>
                        <HowItWorksPopup />
                        <div className="flex flex-col">
                            <div className="flex justify-center">
                                <textarea type="text" rows={15} placeholder='Enter Dream' className="DreamBox border-2 border-black rounded-lg text-black md:w-3/4 md:m-0 m-2 w-full" />
                            </div>
                        </div>
                        <div>
                            {error && (
                                <div className="bg-red-500 w-max p-1 rounded-xl">{error}</div>
                            )}  
                        </div>
                        <OracleSelectionPopup />
                        <div className="justify-center flex lg:flex-row flex-col">
                            {oracles.map((oracle) => {
                            
                                let isSelected = selectedOracles[oracle.oracleID];

                                return (
                                    <div key={oracle._id} className="flex flex-col justify-center items-center p-5">
                                        <div className="w-48 h-48 relative">
                                            <Image 
                                                layout="fill"
                                                src={oracle.oraclePicture} 
                                                alt={oracle.oracleName} 
                                                className={`rounded-xl text-center cursor-pointer ${isSelected ? 'border-4 border-blue-500' : ''}`}
                                                onClick={() => handleSelectionChange(oracle.oracleID)} 
                                                htmlFor={oracle.oracleID}
                                            />
                                        </div>
                                        <label htmlFor={oracle.oracleID}>{oracle.oracleName}</label>
                                    </div>
                            )})}
                        </div>
                        <ResponseTypePopup />
                        <div className="justify-center flex">
                            <div className="flex justify-center p-5">
                                <input 
                                    type="checkbox" 
                                    id="short" 
                                    name="short" 
                                    value="short" 
                                    onChange={handleCheckboxChange}
                                    checked={short}
                                ></input>
                                <label htmlFor="short">Short</label>
                            </div>
                        </div>
                        <button className="rounded-xl bg-blue-600 p-2 m-2 absolute right-0" onClick={journalDream}>{buttonText}</button><br />
                    </div>
                </div>
            )}
        </div>

    )
}

const HowItWorksPopup = () => {

    return (
        <div className="flex justify-center text-3xl pb-5 p-3">
            Enter Dream Description Below
            <Popup 
                trigger={<button><FontAwesomeIcon icon={faInfoCircle} className="ml-2"/></button>} 
                position="bottom right center"
                contentStyle={{width: "50%"}}
            >
                <b>How do I write a good prompt?</b><br/>
                Describe your dream in as much detail as you can. The more detail you provide, the more accurate the interpretation will be.
                If you can, also try and describe how you felt during the dream. Were you scared? Happy? Sad? Angry? 
                Who was in your dream? Don&apos;t use names, describe their relationship to you. Was it a friend? A family member? A stranger?
                <br/><br/>
                <b>I have a theory about what my dream means</b><br/>
                Great! Please include this in the prompt. If you have no idea what the dream means, that is fine it will still work fine.
                But, if you think it is relating to something in real life, include this in the dream. Our dreams are inspired by real life,
                and it is important to paint the full picture as much as possible. 
            </Popup>
        </div>
    )
}

const OracleSelectionPopup = () => {

    return (
        <div className="flex justify-center text-3xl pt-5 p-3 text-center">
            Select Oracles to Interpret Your Dreams
            <Popup 
                trigger={<button><FontAwesomeIcon icon={faInfoCircle} className="ml-2"/></button>} 
                position="bottom right center"
                contentStyle={{width: "50%"}}
            >
                <b>Selecting oracles</b><br/>
                Here, you can select which oracles you would like to interpret your dream. You can select as
                many as you&apos;d like, or none at all. Their interpretations will appear under the dream details page.
            </Popup>
        </div>
    )
}

const ResponseTypePopup = () => {

    return (
        <div className="flex justify-center text-3xl pt-5">
            Select Response Type
            <Popup 
                trigger={<button><FontAwesomeIcon icon={faInfoCircle} className="ml-2"/></button>} 
                position="top right center"
                contentStyle={{width: "50%"}}
            >
                <b>Short</b><br/>
                If you are looking for a simple interpretation, we recommend checking short. This will speed up interpretation time,
                and give you a more concise answer. If you are looking for a more detailed interpretation, we recommend leaving this unchecked.<br/>
                <b>Simplify</b><br/>
                Some of our oracles, especially Carl and Freud can be a bit wordy and hard to understand for beginners. If you aren't as familiar with
                with some of their work, we recommend checking this box. This will simplify their interpretations to be more beginner friendly.<br/>
                <b>Expert</b><br/>
                If you are looking for a more advanced interpretation, we recommend checking this box. All of our oracles are more than happy to go into 
                full detail about your dream and draw upon their knowledge extensively. This is great for people who are interested in going deeper and want 
                more information about their dream as it relates to the oracles dream knowledge.<br/>
                <b>Educate</b><br/>
                If you're a beginner and want to learn more about dream interpretation, we recommend checking this box. Our oracles will take a more educational 
                approach and provide lessons and ideas from their work to fill you in on their dream interpretation process. If you're more curious about learning about
                a particular oracles work, we recommend checking this box.<br/>
                <b>Entertain</b><br/>
                If you're looking for a more entertaining interpretation, we recommend checking this box. Our oracles will take a more creative and fun apporach to
                your dream. <br/><br/>
                <b>Warning</b><br/>
                What you select will impact the speed and accuracy of your interpretations. Longer, more detailed interpreations can take up to 2 minutes, while shorten
                interpretations should only take a couple seconds.
            </Popup>
        </div>
    )
}