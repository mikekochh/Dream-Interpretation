"use client";Popup
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import 'reactjs-popup/dist/index.css';
import Popup from 'reactjs-popup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faStarAndCrescent } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';

export default function JournalForm() { 

    const { data: session } = useSession();
    const [user, setUser] = useState(null);
    const [error, setError] = useState(false);
    const [savingDream, setSavingDream] = useState(false);
    const [oracles, setOracles] = useState([]);
    const [buttonText, setButtonText] = useState("Journal Dream");
    const [newDreamID, setNewDreamID] = useState(null);
    const [subscribed, setSubscribed] = useState(false);
    const [interpretingDream, setInterpretingDream] = useState(false);
    const [saveMessage, setSaveMessage] = useState("Your dream has been saved.");
    const [creditCost, setCreditCost] = useState(0);
    const [oracleSelected, setOracleSelected] = useState(false);
    const [localInterpretation, setLocalInterpretation] = useState("");
    const [dream, setDream] = useState("");
    const [justJournal, setJustJournal] = useState(false);
    const [interpretationProgressArray, setInterpretationProgressArray] = useState([0, 0, 0, 0, 0]);
    const [interpretationProgressIndex, setInterpretationProgressIndex] = useState(0);

    const localCreditsGiven = useRef(false);
    const dreamButtonTopRef = useRef(null);
    const dreamButtonBottomRef = useRef(null);

    useEffect(() => {
        if (interpretingDream) {
            const interval = setInterval(() => {
                setInterpretationProgressArray(prevArray => {
                    const updatedArray = [...prevArray];
                    if (updatedArray[interpretationProgressIndex] <= 95) {
                        updatedArray[interpretationProgressIndex] += .10;
                        return updatedArray;
                    }
                    else {
                        return updatedArray;
                    }
                });
            }, 25);
            return () => clearInterval(interval);
        }
    }, [interpretingDream, interpretationProgressArray.length, interpretationProgressIndex])

    useEffect(() => {
        // Function to load the Google Tag Manager script
        const loadGTag = () => {
            const script = document.createElement('script');
            script.src = "https://www.googletagmanager.com/gtag/js?id=G-1TF2VESNGX";
            script.async = true;
            document.head.appendChild(script);

            script.onload = () => {
                window.dataLayer = window.dataLayer || [];
                function gtag() {
                    dataLayer.push(arguments);
                }
                gtag('js', new Date());
                gtag('config', 'G-1TF2VESNGX');
            };
        };

        // Load the script if it's not already loaded
        if (!window.gtag) {
            loadGTag();
        }

    }, []);

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
        // if they have never been to the website before, give them 1 free credit
        // else if they have been to the website before, but have not spent their free credit, give them 1 free credit
        // else if they have been to the website before, and they have spent their free credit, give them 0 credits
        else if (!document.cookie.includes('visited=true')) {
            setUser({ credits: 1 });
            document.cookie = "visited=true; max-age=31536000";
            document.cookie = "spentCredits=false; max-age=31536000";
            localCreditsGiven.current = true;
        }
        else if (document.cookie.includes('visited=true') && !document.cookie.includes('spentCredits=true')) {
            setUser({ credits: 1 });
            localCreditsGiven.current = true;
        }
        else if (document.cookie.includes('visited=true') && document.cookie.includes('spentCredits=true')) {
            setUser({ credits: 0 });
            localCreditsGiven.current = true;
        }
    }, [session, localCreditsGiven]);

    useEffect(() => {
        for (const oracle of oracles) {
            if (oracle.selected) {
                setOracleSelected(true);
                setButtonText("Journal Dream and Interpret");
                return;
            }
        }
        setOracleSelected(false);
        setButtonText("Journal Dream");
    }, [oracles]);


    useEffect(() => {
        if (dreamButtonBottomRef.current === null) return;
        if (user?.name) {
            dreamButtonTopRef.current.classList.remove("blur");
            dreamButtonTopRef.current.classList.remove("pointer-events-none");
            dreamButtonBottomRef.current.classList.remove("blur");
            dreamButtonBottomRef.current.classList.remove("pointer-events-none");
        }
        else {
            if (oracleSelected) {
                dreamButtonTopRef.current.classList.remove("blur");
                dreamButtonTopRef.current.classList.remove("pointer-events-none");
                dreamButtonBottomRef.current.classList.remove("blur");
                dreamButtonBottomRef.current.classList.remove("pointer-events-none");
            }
            else {
                dreamButtonTopRef.current.classList.add("blur");
                dreamButtonTopRef.current.classList.add("pointer-events-none");
                dreamButtonBottomRef.current.classList.add("blur");
                dreamButtonBottomRef.current.classList.add("pointer-events-none");
            }
        }
    }, [oracleSelected, user]);

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
            if (user.name) {
                setError("You don't have enough credits. Please select less oracles or buy more credits");
            }
            else {
                setError("You don't have enough credits. Please select less oracles or create an account");
            }
            setSavingDream(false);
            return;
        }
        setSavingDream(true);
        const userID = user._id;
        try {
            // if there is a user, save the dream to their account, interpret the dream, and save the interpretation to their account.
            if (userID) {
                const resJournal = await axios.post('/api/dream/journal', { userID, dream, interpretDream: oracleSelected });
                const dreamID = resJournal.data._id;
                setNewDreamID(dreamID);
                if (oracleSelected) {
                    interpretDreams(dreamID);
                }
                else {
                    setJustJournal(true);
                }
            }
            // if there is no user, interpret the dream and display it to the screen. Save dream to database for if user creates an account
            else {
                const resJournal = await axios.post('/api/dream/journal', { userID: 0, dream, interpretDream: oracleSelected });
                const dreamID = resJournal.data._id;
                localStorage.setItem('dreamID', dreamID);
                interpretDreams(dreamID);
                document.cookie = "spentCredits=true; max-age=31536000";
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

                // await delay(10000);

                setInterpretationProgressArray(prevArray => {
                    const updatedArray = [...prevArray];
                    updatedArray[i] = 100;
                    return updatedArray;
                });
                setInterpretationProgressIndex(i+1);

                if (user._id === undefined) {
                    setLocalInterpretation(resInterpret.data[0].message.content);
                    setInterpretingDream(false);
                    setSaveMessage("Here is your interpretation:");
                    journalDreamNoAccount();
                    return;
                }
            }
        }

        setInterpretingDream(false);
        setSaveMessage("Dream interpretation complete! You can now view your dream interpretation under the dream details page.");
    }

    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

    const journalDreamNoAccount = () => {
        if (window.gtag) {
            window.gtag('event', 'interpret_dream_no_account', {
                'event_category': 'Dream Activity',
                'event_label': 'No Account'
            });
        }
        else {
            console.error('gtag script not loaded yet');
        }
    }

    const resetPage = () => {
        window.location.reload();
    }

    const goToDreamDetails = () => {
        window.location.href = `/dreamDetails?dreamID=${newDreamID}`;
    }

    const handleCheckboxChange = (event) => {
        setShort(event.target.checked);
    };

    const insertLineBreaks = (text) => {
        const lines = text.split('\n');
        return lines.map((line, index) => (
          <React.Fragment key={index}>
            {line}
            {index < lines.length - 1 && <br />}
          </React.Fragment>
        ));
    }

    return (
        <div className="text-white main-content relative">
            {savingDream ? (
                <div className="flex justify-center">
                {/* usually have these classNames above: justify-center items-center middle-content */}
                    <div className="flex justify-center items-center flex-col">
                        <p className="text-center text-2xl">
                            {saveMessage}
                        </p>
                        <div className="flex justify-center">
                            {interpretingDream ? (
                                <div>
                                    <div className="flex flex-row text-center items-center justify-center inset-0">
                                        <p className="text-2xl p-4">Please wait while we interpret your dream...</p>
                                        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32"></div>
                                    </div>
                                    <div>
                                        {oracles.map((oracle, index) => {

                                            if (oracle.selected) {

                                                return (
                                                    <div key={oracle._id}>
                                                        <div>{oracle.oracleName}</div>
                                                        <div data-label="Interpreting..." className="progress-bar">
                                                            <div className="progress-bar-inside" style={{width: `${interpretationProgressArray[index]}%`}}>Interpreting...</div>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        })}
                                    </div>
                                </div>

                            ) : (
                                <div className="">
                                    {localInterpretation ? (
                                        <div className="text-center">
                                            <a href="/createAccount" className="underline">Create a free account to continue interpreting dreams and unlock all features</a>
                                            <p className="rounded-xl p-2 border border-white m-2 overflow-auto">{insertLineBreaks(localInterpretation)}</p>
                                            <a href="/createAccount" className="underline">Create a free account to continue interpreting dreams and unlock all features</a>
                                        </div>
                                    ) : (
                                        <div>
                                            <button className="dream-button" onClick={resetPage}>Journal New Dream</button>
                                            {!justJournal && (<button className="dream-button" onClick={goToDreamDetails}>Go To Dream Details</button>)}
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
                            {!user?.name && (
                                <a href='/createAccount' className="underline font-bold hidden md:block">Create an account for 5 dream credits</a>
                            )}
                        </div>
                    )}
                    <button className="dream-button" ref={dreamButtonTopRef} onClick={journalDream}>
                        {buttonText}
                    </button>
                    <div>
                        {user?.name ? (
                            <p className="text-3xl text-center">Welcome back {user?.name} <FontAwesomeIcon icon={faStarAndCrescent} /></p>
                        ) : (
                            <div>
                                <p className="text-3xl text-center">Welcome to Dream Oracles</p>
                                <p className="text-2xl text-center">Diverse and powerful dream interpretation</p>
                            </div>

                        )}
                        
                        <HowItWorksPopup />
                        <div className="flex flex-col">
                            <div className="flex justify-center">
                                <textarea type="text" rows={5} placeholder='Dream description here' className="DreamBox border-2 p-1 border-black rounded-lg text-black md:w-3/4 md:m-0 m-2 w-full" onChange={(event) => setDream(event.target.value)}  />
                            </div>
                        </div>
                        <div>
                            {error && (
                                <div className="bg-red-500 w-max p-1 text-black font-bold rounded-xl whitespace-nowrap">{error}</div>
                            )}  
                            <div id="interpretation-section" className="relative">
                                <div className={`${user?.credits === 0 && !subscribed ? 'blur pointer-events-none' : ''}`}>
                                    <OracleSelectionPopup />
                                    <div className="justify-center items-center flex md:flex-row flex-col">
                                        {oracles.map((oracle) => {

                                            return (
                                                <div key={oracle._id} className="flex flex-col justify-center items-center oracle-wrapper m-4">
                                                    {oracle.bannerMessage && (<div className="ribbon-2 font-bold">{oracle.bannerMessage}</div>)}
                                                    <OracleSection oracle={oracle} handleSelectionChange={handleSelectionChange} />
                                                </div>
                                            )})}
                                    </div>
                                    <button ref={dreamButtonBottomRef} className="dream-button absolute right-0 bottom-0" onClick={journalDream}>
                                        {buttonText}
                                    </button><br />
                                </div>
                                {user?.credits === 0 && !user?.name ? (
                                    <div className="absolute inset-0 flex flex-col md:justify-center items-center">
                                        <span className="text-3xl font-semibold text-center mt-5 md:mt-0">Create an account to continue interpreting your dreams</span>
                                        <button className="rounded-xl bg-blue-600 dream-button m-2 pl-4 pr-4 justify-center item p-10" onClick={() => window.location.href = '/pricing'}>Create Account</button>
                                    </div>
                                ) : user?.credits === 0 && !subscribed ? (
                                    <div className="absolute inset-0 flex flex-col md:justify-center items-center">
                                        <span className="text-3xl font-semibold text-center mt-5 md:mt-0">You must buy more credits or start a subscription to interpret your dreams</span>
                                        <button className="rounded-xl bg-blue-600 dream-button m-2 pl-4 pr-4 justify-center item p-10" onClick={() => window.location.href = '/pricing'}>See Pricing</button>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

const HowItWorksPopup = () => {

    const [open, setOpen] = useState(false);

    return (
        <div className="justify-center items-center flex flex-col text-3xl pb-5 p-3 text-center">
            Enter Dream Description Below
            <div className="dropdown w-full md:w-3/4 flex flex-col md:flex-row">
                <FontAwesomeIcon icon={faInfoCircle} className="ml-2 cursor-pointer" onClick={() => setOpen(o => !o)}/>
                <div className={`${open ? 'popup-menu-active' : 'popup-menu'}`}>
                    <p className="text-xl select-none">
                        <b>Describing your dream</b><br/>
                        Describe your dream in as much detail as you can remember. Prevent yourself from using names when talking about people in the dream,
                        and instead describe their relationship to you.
                    </p>
                </div>
            </div>
        </div>
    )
}

const OracleSelectionPopup = () => {

    const [open, setOpen] = useState(false);

    return (
        <div className="justify-center text-3xl pt-5 p-3 text-center">
            Select Oracles to Interpret Your Dreams
            <div className="dropdown w-full md:w-3/4 flex flex-col md:flex-row">
                <FontAwesomeIcon icon={faInfoCircle} className="ml-2 cursor-pointer" onClick={() => setOpen(o => !o)}/>
                <div className={` ${open ? 'popup-menu-active' : 'popup-menu'}`}>
                    <p className="text-xl select-none">
                        <b>Choosing Dream Oracles</b><br/>
                        Here, you can select as many oracles as you would like to interpret your dreams.
                        The more Oracles you select, the longer it will take to interpret your dream.
                        Click on the info icon next to each oracle to learn about their interpretation style.
                    </p>
                </div>
            </div>
        </div>
    )
}

const OracleSection = ({ oracle, handleSelectionChange }) => {

    const [open, setOpen] = useState(false);
    
    return (
        <div className="text-center whitespace-nowrap relative">
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
            <label htmlFor={oracle.oracleID} className={`${oracle.selected ? "text-gold" : ""}`}>
                {oracle.oracleName}<FontAwesomeIcon icon={faInfoCircle} className="ml-2 cursor-pointer" onClick={() => setOpen(o => !o)} />
                <div className={`whitespace-pre-wrap ${open ? 'oracle-menu-active' : 'oracle-menu'}`}>
                    <p className="text-md">
                        <b>Specialty: </b>{oracle.oracleSpecialty}<br/><br/>
                        {oracle.oracleDescriptionShort}
                    </p>
                </div>
            </label>
            
        </div>
    )
}
