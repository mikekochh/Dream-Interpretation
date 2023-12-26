"use client";
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import 'reactjs-popup/dist/index.css';
import Popup from 'reactjs-popup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faArrowDown, faArrowDownUpLock, faArrowUp} from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';

export default function JournalForm() { 

    const { data: session } = useSession();
    const [user, setUser] = useState(null);
    const [error, setError] = useState(false);
    const [savingDream, setSavingDream] = useState(false);
    const [oracles, setOracles] = useState([]);
    const [newDreamID, setNewDreamID] = useState(null);
    const [subscribed, setSubscribed] = useState(false);
    const [interpretingDream, setInterpretingDream] = useState(false);
    const [saveMessage, setSaveMessage] = useState("Your dream has been saved.");
    const [creditCost, setCreditCost] = useState(0);
    const [oracleSelected, setOracleSelected] = useState(false);
    const journalSectionRef = useRef(null);
    const interpretationSectionRef = useRef(null);
    const [dream, setDream] = useState("");
    const [step, setStep] = useState(1);
    const [localInterpretation, setLocalInterpretation] = useState("");


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
                setSubscribed(userData.subscribed);
                setUser(userData);
            }).catch(err => {
                console.log('err: ', err);
            });
        }
        else {
            // if there is no session, give users free trial of application. Give them 2 credits to start with, and they can only enter dream and then get an interpretation. It does not save the interpretation, only shows the user the interpretation. 
            setUser({ credits: 1 });

        }
    }, [session]);  

    useEffect(() => {
        for (const oracle of oracles) {
            if (oracle.selected) {
                setOracleSelected(true);
                return;
            }
        }
        setOracleSelected(false);
    }, [oracles]);

    useEffect(() => {
        async function getOracles() {
            const res = await axios.get('/api/oracles');
            const oracles = res.data.sort((a, b) => a.oracleID - b.oracleID);
            setOracles(oracles);
        }

        getOracles();
    }, []);

    function handleSelectionChange(selected, oracleID) {
        setCreditCost(prevCost => selected ? prevCost - 1 : prevCost + 1);
        setOracles(prev => {
            const updatedOracles = [...prev];
            const oracleIndex = updatedOracles.findIndex(oracle => oracle.oracleID === oracleID);
            updatedOracles[oracleIndex].selected = !selected;
            return updatedOracles;
        });
    }

    async function journalDream() {
        var dream = document.querySelector('.DreamBox').value;
        if (!dream) {
            setError("Please enter a dream");
            return;
        }
        if (!subscribed && creditCost > user.credits) {
            setError("You don't have enough credits to get this many interpretations. Please select less oracles or buy more credits");
            return;
        }
        setSavingDream(true);
        const userID = user._id;
        try {
            // if there is a user, save the dream to their account, interpret the dream, and save the interpretation to their account.
            if (userID) {
                const resJournal = await axios.post('/api/dream/journal', { userID, dream, oracleSelected });
                setNewDreamID(resJournal.data._id);
                if (oracleSelected) {
                    interpretDreams(resJournal.data._id);
                }
            }
            // if there is no user, interpret the dream and display it to the screen. Do not save interpretation or dream to database. 
            else {
                interpretDreams(null);
            }
        }
        catch (error) {
            setError("Error Journaling Dream");
            console.log("error: ", error);
        }   
    }

    const interpretDreams = async (dreamID) => {
        if (dreamID) {
            setSaveMessage("Your dream has been saved and is currently being interpreted.");
        }
        else {
            setSaveMessage("Your dream is currently being interpreted.");
        }
        setInterpretingDream(true);
        for (let i = 0; i < oracles.length; i++) {
            if (oracles[i].selected) {
                const dreamPrompt = oracles[i].prompt + "\n###\n" + dream;
                const resInterpret = await axios.get('https://us-central1-dream-oracles.cloudfunctions.net/dreamLookup',
                {
                    params: {
                        dreamPrompt: dreamPrompt
                    }
                });

                if (resInterpret.status !== 200) {
                    setError("Error Interpreting Dream");
                    return;
                }

                if (dreamID) { 
                    const resUpdateDatabase = await axios.post('/api/dream/interpret', 
                    { 
                        dreamID, 
                        interpretation: resInterpret.data[0].message.content,
                        oracleID: oracles[i].oracleID, 
                        user
                    });
    
                    if (resUpdateDatabase.status !== 200) {
                        setError("Error Saving Interpretation");
                        return;
                    }
                }
                else {
                    setLocalInterpretation(resInterpret.data[0].message.content);
                    setInterpretingDream(false);
                    setSaveMessage("Dream interpretation complete! You can now view your dream interpretation below.");
                    return;
                }
            }
        }
        setInterpretingDream(false);
        setSaveMessage("Dream interpretation complete! You can now view your dream interpretation under the dream details page.");
    }

    const resetPage = () => {
        window.location.reload();
    }

    const goToDreamDetails = () => {
        window.location.href = `/dreamDetails?dreamID=${newDreamID}`;
    }

    const goToSelectOracles = () => {
        if (journalSectionRef.current) {
            journalSectionRef.current.classList.add("fade-upwards-out");
            journalSectionRef.current.classList.add("hidden");
        }

        if (interpretationSectionRef.current) {
            interpretationSectionRef.current.classList.add("fade-upwards-in");
            interpretationSectionRef.current.classList.remove("hidden");
        }
        setStep(2);
    }

    const goBackToJournal = () => {
        if (journalSectionRef.current) {
            journalSectionRef.current.classList.remove("fade-upwards-out");
            journalSectionRef.current.classList.remove("hidden");
        }

        if (interpretationSectionRef.current) {
            interpretationSectionRef.current.classList.remove("fade-upwards-in");
            interpretationSectionRef.current.classList.add("hidden");
        }
        setStep(1);
    }

    return (
        <div className="text-white main-content relative h-full">
            {savingDream ? (
                <div className="flex justify-center items-center middle-content">
                    <div className="flex justify-center items-center flex-col">
                        <p className="text-center text-2xl p-4">
                            {saveMessage}
                        </p>
                        <div className="flex justify-center">
                            {interpretingDream ? (
                                <div className="flex flex-row text-center items-center justify-center inset-0">
                                    <p className="text-2xl p-4">Please wait while we interpret your dream...</p>
                                    <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32"></div>
                                </div>
                            ) : (
                                <div>
                                    {localInterpretation ? (
                                        <div className="text-2xl text-center">
                                            <h1>Here is your interpretation:</h1>
                                            <p>{localInterpretation}</p>
                                            <a href="/home" className="underline">Create a free account to continue interpreting dreams and unlock all features</a>
                                        </div>
                                    ) : (
                                        <div>
                                            <button className="rounded-xl bg-blue-600 p-2 m-2 pl-4 pr-4 justify-center item" onClick={resetPage}>Journal New Dream</button>
                                            <button className="rounded-xl bg-blue-600 p-2 m-2 pl-4 pr-4 justify-center item" onClick={goToDreamDetails}>Go To Dream Details</button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>  
                    </div>
                </div>
            ) : (
                <div>
                    {!subscribed && (
                        <div className="absolute right-0 top-0 p-2 main-content">
                            <p className="text-right">Dream Credits: {user?.credits}</p>
                            {!user?.activated && (
                                <a href='/home' className="underline">Create an account for 5 dream credits</a>
                            )}
                        </div>
                    )}
                    <div>
                        <div className="journal-section" ref={journalSectionRef}>
                            {user?.name ? (
                                <p className="text-3xl text-center">Welcome back {user?.name}</p>
                            ) : (
                                <p className="text-3xl text-center">Welcome to Dream Oracles</p>
                            )}
                            <HowItWorksPopup />
                            <div className="flex flex-col">
                                <div className="flex justify-center">
                                    <textarea type="text" rows={15} placeholder='Enter Dream' className="DreamBox border-2 p-1 border-black rounded-lg text-black md:w-3/4 md:m-0 m-2 w-full" onChange={(event) => setDream(event.target.value)}  />
                                </div>
                            </div>
                            {error && (
                                <div className="bg-red-500 w-max p-1 text-black font-bold rounded-xl">{error}</div>
                            )}  
                            {dream && (
                                <div className="flex justify-center absolute bottom-0 left-1/2 transform -translate-x-1/2 text-3xl items-center m-2">
                                    <div className="text-center w-fit p-1 rounded-xl next-stage" onClick={goToSelectOracles}>
                                        <FontAwesomeIcon icon={faArrowDown} className="mr-2"/>
                                        <FontAwesomeIcon icon={faArrowDown} className="mr-2"/>
                                        <FontAwesomeIcon icon={faArrowDown} className="mr-2"/>
                                        Select Oracles
                                        <FontAwesomeIcon icon={faArrowDown} className="ml-2"/>
                                        <FontAwesomeIcon icon={faArrowDown} className="ml-2"/>
                                        <FontAwesomeIcon icon={faArrowDown} className="ml-2"/>
                                    </div>
                                </div>
                            )}

                        </div>
                        <div id="interpretation-section" className="hidden" ref={interpretationSectionRef}>
                            <div className="flex justify-center text-3xl items-center">
                                <div className="text-center w-fit p-1 rounded-xl next-stage" onClick={goBackToJournal}>
                                    <FontAwesomeIcon icon={faArrowUp} className="mr-2"/>
                                    <FontAwesomeIcon icon={faArrowUp} className="mr-2"/>
                                    <FontAwesomeIcon icon={faArrowUp} className="mr-2"/>
                                    Journal Dream
                                    <FontAwesomeIcon icon={faArrowUp} className="ml-2"/>
                                    <FontAwesomeIcon icon={faArrowUp} className="ml-2"/>
                                    <FontAwesomeIcon icon={faArrowUp} className="ml-2"/>
                                </div>
                            </div>
                            <div className={`${user?.credits === 0 && !subscribed ? 'blur pointer-events-none' : ''}`}>
                                <OracleSelectionPopup />
                                <div className="justify-center flex md:flex-row flex-col">
                                    {oracles.map((oracle) => {

                                        return (
                                            <div key={oracle._id} className="flex flex-col justify-center items-center p-5">
                                                <div className="w-full relative max-w-sm hidden md:block">
                                                    <Image 
                                                        layout="responsive"
                                                        width={100}
                                                        height={100}
                                                        src={oracle.oraclePicture} 
                                                        alt={oracle.oracleName} 
                                                        className={`rounded-xl text-center cursor-pointer ${oracle.selected ? 'border-8 border-gold' : ''}`}
                                                        onClick={() => handleSelectionChange(oracle.selected, oracle.oracleID)} 
                                                        htmlFor={oracle.oracleID}
                                                    />
                                                </div>
                                                <div className="w-full relative max-w-sm md:hidden oracle-image-mobile">
                                                    <Image 
                                                        layout="responsive"
                                                        width={100}
                                                        height={100}
                                                        src={oracle.oraclePicture} 
                                                        alt={oracle.oracleName} 
                                                        className={`rounded-xl text-center cursor-pointer ${oracle.selected ? 'border-4 border-gold' : ''}`}
                                                        onClick={() => handleSelectionChange(oracle.selected, oracle.oracleID)} 
                                                        htmlFor={oracle.oracleID}
                                                    />
                                                </div>
                                                <label htmlFor={oracle.oracleID} className={`${oracle.selected ? "text-gold" : ""}`}>{oracle.oracleName}</label>
                                            </div>
                                    )})}
                                </div>
                            </div>
                        </div>
                        {oracleSelected && step === 2 && (
                            <div className="flex justify-center absolute bottom-0 left-1/2 transform -translate-x-1/2 text-3xl items-center m-2">
                                <div className="text-center w-fit p-1 rounded-xl next-stage" onClick={journalDream}>
                                    <FontAwesomeIcon icon={faArrowDown} className="mr-2"/>
                                    <FontAwesomeIcon icon={faArrowDown} className="mr-2"/>
                                    <FontAwesomeIcon icon={faArrowDown} className="mr-2"/>
                                    Interpret Dream
                                    <FontAwesomeIcon icon={faArrowDown} className="ml-2"/>
                                    <FontAwesomeIcon icon={faArrowDown} className="ml-2"/>
                                    <FontAwesomeIcon icon={faArrowDown} className="ml-2"/>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

const HowItWorksPopup = () => {

    return (
        <div className="flex justify-center items-center text-3xl pb-5 p-3 text-center">
            <span className="inline-flex items-center">Enter Dream Description Below
                <Popup 
                    trigger={<button><FontAwesomeIcon icon={faInfoCircle} className="ml-2"/></button>} 
                    position="bottom right center"
                    contentStyle={{width: "50%"}}
                >
                    <b>Describing your dream</b><br/>
                    Describe your dream in as much detail as you can remember. Prevent yourself from using names when talking about people in the 
                    dream, and instead describe their relationship to you.
                </Popup>
            </span>
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