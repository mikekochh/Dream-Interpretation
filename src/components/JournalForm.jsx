"use client";
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import 'reactjs-popup/dist/index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faStarAndCrescent, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import RegisterForm from './RegisterForm';

const JournalForm = () => {
    const { data: session, status } = useSession();
    const [user, setUser] = useState(null);
    const [error, setError] = useState(false);
    const [savingDream, setSavingDream] = useState(false);
    const [oracles, setOracles] = useState([]);
    const [buttonText, setButtonText] = useState("Journal Dream");
    const [newDreamID, setNewDreamID] = useState(null);
    const [interpretingDream, setInterpretingDream] = useState(false);
    const [saveMessage, setSaveMessage] = useState("Your dream has been saved.");
    const [oracleSelected, setOracleSelected] = useState(false);
    const [dream, setDream] = useState("");
    const [justJournal, setJustJournal] = useState(false);
    const [interpretationProgressArray, setInterpretationProgressArray] = useState([0, 0, 0, 0]);
    const [interpretationProgressIndex, setInterpretationProgressIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [progressBarClass, setProgressBarClass] = useState('progress-bar-width-mobile');

    const localCreditsGiven = useRef(false);

    useEffect(() => {
        setLoading(status === 'loading');
    }, [status]);

    useEffect(() => {
        if (interpretingDream) {
            const interval = setInterval(() => {
                setInterpretationProgressArray(prevArray => {
                    const updatedArray = [...prevArray];
                    if (updatedArray[interpretationProgressIndex] <= 99) {
                        updatedArray[interpretationProgressIndex] += 0.10;
                    }
                    return updatedArray;
                });
            }, 25);
            return () => clearInterval(interval);
        }
    }, [interpretingDream, interpretationProgressIndex]);

    useEffect(() => {
        const loadGTag = () => {
            const script = document.createElement('script');
            script.src = "https://www.googletagmanager.com/gtag/js?id=G-1TF2VESNGX";
            script.async = true;
            document.head.appendChild(script);

            script.onload = () => {
                window.dataLayer = window.dataLayer || [];
                function gtag() { dataLayer.push(arguments); }
                gtag('js', new Date());
                gtag('config', 'G-1TF2VESNGX');
            };
        };

        if (!window.gtag) {
            loadGTag();
        }
    }, []);

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
    }, [session, localCreditsGiven]);

    useEffect(() => {
        const selectedOracle = oracles.some(oracle => oracle.selected);
        setOracleSelected(selectedOracle);
        setButtonText(selectedOracle ? "Journal Dream and Interpret" : "Journal Dream");
    }, [oracles]);

    useEffect(() => {
        const getOracles = async () => {
            try {
                const res = await axios.get('/api/oracles');
                setOracles(res.data.sort((a, b) => a.oracleID - b.oracleID));
            } catch (error) {
                console.log('Error fetching oracles:', error);
            }
            setLoading(false);
        };

        getOracles();
    }, []);

    useEffect(() => {
        const handleResize = () => {
            setProgressBarClass(window.innerWidth > 768 ? 'progress-bar-width-desktop' : 'progress-bar-width-mobile');
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleSelectionChange = (selected, oracleID) => {
        setOracles(prev => {
            const updatedOracles = [...prev];
            const oracleIndex = updatedOracles.findIndex(oracle => oracle.oracleID === oracleID);
            updatedOracles[oracleIndex].selected = !selected;
            return updatedOracles;
        });
    };

    const journalDream = async () => {
        const dreamText = document.querySelector('.DreamBox').value;
        if (!dreamText) {
            setError("Please enter a dream");
            return;
        }
        setSavingDream(true);
        const userID = user?._id;
        try {
            const resJournal = await axios.post('/api/dream/journal', { userID, dream: dreamText, interpretDream: oracleSelected });
            const dreamID = resJournal.data._id;
            setNewDreamID(dreamID);
            if (oracleSelected) {
                interpretDreams(dreamID);
            } else {
                setJustJournal(true);
            }
        } catch (error) {
            setError("Error Journaling Dream");
            console.log("error:", error);
        }
    };

    async function getGenderName(genderID) {
        try {
          const response = await axios.get(`/api/gender`, { params: { genderID } });
          if (response.data && response.data.name) {
            return response.data.name;
          }
        } catch (error) {
          console.error('Error fetching gender name:', error);
          return null;
        }
      }

    const interpretDreams = async (dreamID) => {
        setSaveMessage(dreamID ? "Your dream has been saved and is currently being interpreted." : "Your dream is currently being interpreted.");
        setInterpretingDream(true);

        let userDetails = [];

        if (user.genderID) {
            const genderName = await getGenderName(user.genderID);
            if (genderName) {
              userDetails.push(`Gender: ${genderName}`);
            }
        }
        if (user.age) {
            userDetails.push(`Age: ${user.age}`);
        }
        if (user.culturalBackground) {
            userDetails.push(`Cultural Background: ${user.culturalBackground}`);
        }
        if (user.spiritualPractices) {
            userDetails.push(`Spiritual Practices: ${user.spiritualPractices}`);
        }

        let additionalContext = '';
        if (userDetails.length > 0) {
            additionalContext = `\nIf provided, consider the following details about the dreamer to add context to the interpretation, but only if they are relevant to the dream: ${userDetails.join(', ')}. If these details do not seem relevant, feel free to disregard them.\n`;
        }

        for (let i = 0; i < oracles.length; i++) {
            if (oracles[i].selected) {
                try {
                    // const dreamPrompt = `${oracles[i].prompt}\n###\n${dream}`;
                    const dreamPrompt = `${oracles[i].prompt}${additionalContext}\nHere is the dream:\n###\n${dream}`;
                    console.log("dreamPrompt: ", dreamPrompt);
                    const resInterpret = await axios.get('https://us-central1-dream-oracles.cloudfunctions.net/dreamLookup', { params: { dreamPrompt } });
                    const resUpdateDatabase = await axios.post('/api/dream/interpret', { dreamID, interpretation: resInterpret.data[0].message.content, oracleID: oracles[i].oracleID, user });
                    setInterpretationProgressArray(prevArray => {
                        const updatedArray = [...prevArray];
                        updatedArray[i] = 100;
                        return updatedArray;
                    });
                } catch (error) {
                    setError("Error Interpreting or Saving Interpretation");
                    console.log("error:", error);
                    return;
                }
                setInterpretationProgressIndex(i + 1);
            }
        }
        setInterpretingDream(false);
        setSaveMessage(user?._id ? "Dream interpretation complete! You can now view your dream interpretation under the dream details page." : "Dream interpretation complete!");
    };

    const resetPage = () => {
        window.location.reload();
    };

    const goToDreamDetails = () => {
        window.location.href = `/dreamDetails?dreamID=${newDreamID}`;
    };

    if (loading) {
        return (
            <div className="main-content text-white flex justify-center items-center h-screen">
                <div className='loadingContainer'>
                    <p className='loadingText'>Assembling the Dream Oracles</p>
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
        <div className="text-white main-content relative">
            {savingDream ? (
                <SavingDreamView
                    saveMessage={saveMessage}
                    interpretingDream={interpretingDream}
                    user={user}
                    resetPage={resetPage}
                    justJournal={justJournal}
                    goToDreamDetails={goToDreamDetails}
                    oracles={oracles}
                    interpretationProgressArray={interpretationProgressArray}
                    progressBarClass={progressBarClass}
                />
            ) : (
                <JournalDreamView
                    user={user}
                    error={error}
                    setError={setError}
                    dream={dream}
                    setDream={setDream}
                    handleSelectionChange={handleSelectionChange}
                    oracles={oracles}
                    journalDream={journalDream}
                    buttonText={buttonText}
                />
            )}
        </div>
    );
};

const SavingDreamView = ({
    saveMessage, interpretingDream, user, resetPage, justJournal, goToDreamDetails, oracles, interpretationProgressArray, progressBarClass
}) => (
    <div className="flex justify-center">
        <div className="flex justify-center items-center flex-col">
            <p className="text-center text-2xl">{saveMessage}</p>
            <div className="flex justify-center pb-5">
                {interpretingDream ? (
                    <InterpretingDreamView
                        oracles={oracles}
                        interpretationProgressArray={interpretationProgressArray}
                        progressBarClass={progressBarClass}
                    />
                ) : (
                    <div>
                        {!user && (
                            <div>
                                <div className="golden-ratio-2 text-center font-bold text-gold">
                                    Create an account below to view your dream interpretation
                                </div>
                            </div>
                        )}
                        <div>
                            <button className="dream-button" onClick={resetPage}>Journal New Dream</button>
                            {!justJournal && <button className="dream-button" onClick={goToDreamDetails}>Go To Dream Details</button>}
                        </div>
                    </div>
                )}
            </div>
            {interpretingDream && !user?.name && (
                <div className="flex justify-center">
                    <div className="golden-ratio-2 text-center font-bold text-gold md:w-2/3 mx-5">
                        Create an account below to view your dream interpretation once it&apos;s ready
                    </div>
                </div>
            )}
            {!user && (
                <div className="text-center flex justify-center">
                    <RegisterForm />
                </div>
            )}
        </div>
    </div>
);

const InterpretingDreamView = ({ oracles, interpretationProgressArray, progressBarClass }) => (
    <div>
        <div className='loadingContainer'>
            <p className='loadingText'>Please wait while we interpret your dream</p>
            <div className='dotsContainer'>
                <div className='dot delay200'></div>
                <div className='dot delay400'></div>
                <div className='dot'></div>
            </div>
        </div>
        <div className="flex flex-col items-center w-full">
        {oracles.map((oracle, index) => (
            oracle.selected && (
                <div key={oracle._id} className="flex flex-col items-center max-w-lg w-full">
                    <div className="w-full md:text-left text-center">{oracle.oracleName}</div>
                    <div className="progress-bar-container w-full flex justify-center">
                        <div className={`progress-bar ${progressBarClass}`}>
                            <div className="progress-bar-inside" style={{ width: `${interpretationProgressArray[index]}%` }}>
                                Interpreting...
                            </div>
                        </div>
                    </div>
                </div>
            )
        ))}
        </div>
    </div>
);

const JournalDreamView = ({
    user, error, setError, dream, setDream, handleSelectionChange, oracles, journalDream, buttonText
}) => (
    <div>
        {user?.name ? (
            <p className="text-center golden-ratio-2 mb-5">Welcome back {user?.name}</p>
        ) : (
            <div>
                <p className="text-center golden-ratio-3">Welcome to Dream Oracles</p>
            </div>
        )}
        <div className="right-0 flex flex-row justify-center">
            {!user?.name && (
                <div className="golden-ratio-2 mb-5">
                    <p className="hidden md:flex">
                        <a href='/createAccount' className="underline text-gold mr-2">Create an account</a><span className="text-gold"> or </span>
                        <a href='/login' className="underline hidden md:block text-gold ml-2">Log In</a>
                    </p>
                </div>
            )}
            {!user?.activated && user?.name && (
                <div className="golden-ratio-2 mb-5">
                    <p className="hidden md:flex">
                        <a href={`/emailVerification?email=${user?.email}`} className="underline text-gold mr-2">Register your account</a>
                    </p>
                </div>
            )}
        </div>
        <HowItWorksPopup />
        <div className="flex flex-col">
            <div className="flex justify-center">
                <textarea
                    type="text"
                    rows={5}
                    placeholder='Dream goes here'
                    className="DreamBox golden-ratio-2 border-2 p-1 border-black rounded-lg text-black md:w-3/4 md:m-0 m-2 w-full"
                    onChange={(event) => setDream(event.target.value)}
                />
            </div>
        </div>
        {error && <div className="bg-red-500 w-max p-1 text-black font-bold rounded-xl whitespace-nowrap">{error}</div>}
        <div id="interpretation-section" className="relative">
            <OracleSelectionPopup credits={user?.credits} />
            <div className="justify-center items-center flex md:flex-row flex-col space-x-6">
                {oracles.map(oracle => (
                    <OracleSection
                        key={oracle._id}
                        oracle={oracle}
                        handleSelectionChange={handleSelectionChange}
                        isDisabled={oracle.oracleID !== 1 && !user?.name}
                    />
                ))}
            </div>
            <div className="flex flex-col items-center">
                <button
                    className="dream-button golden-ratio-2 mb-4"
                    onClick={journalDream}
                    disabled={!user?.activated && user?.name}
                >
                    {buttonText}
                </button>
                {!user?.activated && user?.name && (
                    <a className="text-gold golden-ratio-1 underline cursor-pointer" href={`/emailVerification?email=${user?.email}`}>Finish registering your account to continue</a>
                )}
            </div>
        </div>
    </div>
);

const HowItWorksPopup = () => {
    const [open, setOpen] = useState(false);

    return (
        <div className="justify-center golden-ratio-3 text-center">
            <p>1. Share Your Dream With Us <FontAwesomeIcon icon={faQuestionCircle} className="cursor-pointer golden-ratio-2" onClick={() => setOpen(o => !o)} /></p>
            {open && (
                <div className="dropdown w-full md:w-3/4 flex flex-col md:flex-row popup-menu-active">
                    <p className="text-xl select-none">
                        <b>Describing your dream</b><br />
                        Describe your dream in as much detail as you can remember. Prevent yourself from using names when talking about people in the dream,
                        and instead describe their relationship to you.
                    </p>
                </div>
            )}
        </div>
    );
};

const OracleSelectionPopup = ({ credits }) => {
    const [open, setOpen] = useState(false);

    return (
        <div className="justify-center golden-ratio-3 pt-5 leading-none text-center pb-2">
            2. Select Oracles to Interpret Your Dreams <FontAwesomeIcon icon={faQuestionCircle} className="cursor-pointer golden-ratio-2" onClick={() => setOpen(o => !o)} /><br />
            {open && (
                <div className="dropdown w-full md:w-3/4 flex flex-col md:flex-row popup-menu-active">
                    <p className="golden-ratio-2 select-none">
                        <b>Choosing Dream Oracles</b><br />
                        Here, you can select as many oracles as you would like to interpret your dreams.
                        The more Oracles you select, the longer it will take to interpret your dream.
                        Click on the info icon next to each oracle to learn about their interpretation style.
                    </p>
                </div>
            )}
        </div>
    );
};

const OracleSection = ({ oracle, handleSelectionChange, isDisabled }) => {
    const [open, setOpen] = useState(false);

    return (
        <div className={`text-center whitespace-nowrap relative golden-ratio-1 ${isDisabled ? 'disabled-oracle' : ''}`}>
            <div className="w-full relative max-w-sm">
                <Image
                    layout="responsive"
                    width={100}
                    height={100}
                    src={oracle.oraclePicture}
                    alt={oracle.oracleName}
                    className={`rounded-xl text-center cursor-pointer ${oracle.selected ? 'border-8 border-gold' : ''}`}
                    onClick={() => handleSelectionChange(oracle.selected, oracle.oracleID)}
                />
            </div>
            <label className={`${oracle.selected ? "text-gold" : ""}`}>
                {oracle.oracleName}<FontAwesomeIcon icon={faInfoCircle} className="ml-2 cursor-pointer" onClick={() => setOpen(o => !o)} />
                {open && (
                    <div className="whitespace-pre-wrap oracle-menu-active">
                        <p>
                            <b>Specialty: </b>{oracle.oracleSpecialty}<br /><br />
                            {oracle.oracleDescriptionShort}
                        </p>
                    </div>
                )}
            </label>
        </div>
    );
};

export default JournalForm;
