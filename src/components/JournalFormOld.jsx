"use client";
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import RegisterForm from './RegisterForm';
import OracleSection from './OracleSection';

const JournalForm = () => {
    const { data: session, status } = useSession();
    const [user, setUser] = useState(null);
    const [error, setError] = useState(false);
    const [savingDream, setSavingDream] = useState(false); //false
    const [oracles, setOracles] = useState([]);
    const [buttonText, setButtonText] = useState("Journal Dream");
    const [newDreamID, setNewDreamID] = useState(null);
    const [interpretingDream, setInterpretingDream] = useState(false);
    const [saveMessage, setSaveMessage] = useState("");
    const [oracleSelected, setOracleSelected] = useState(false);
    const [dream, setDream] = useState("");
    const [justJournal, setJustJournal] = useState(false);
    const [interpretationProgressArray, setInterpretationProgressArray] = useState([0, 0, 0, 0]);
    const [interpretationProgressIndex, setInterpretationProgressIndex] = useState(0);

    const [loading, setLoading] = useState(true);
    const [loadingSession, setLoadingSession] = useState(true);
    const [loadingOracles, setLoadingOracles] = useState(true);
    const [loadingEmotions, setLoadingEmotions] = useState(true);
    const [loadingDreamStreak, setLoadingDreamStreak] = useState(true);
    const [loadingUser, setLoadingUser] = useState(true);

    const [progressBarClass, setProgressBarClass] = useState('progress-bar-width-mobile');
    const [dreamPublic, setDreamPublic] = useState(false);
    const [emotions, setEmotions] = useState([]);
    const [selectedEmotions, setSelectedEmotions] = useState([]);
    const [errorWhileJournaling, setErrorWhileJournaling] = useState(false);
    const [dreamStreak, setDreamStreak] = useState();

    const [dreamStep, setDreamStep] = useState(0);
    

    const localCreditsGiven = useRef(false);
    const scrollContainerRef = useRef(null);

    useEffect(() => {
        setLoadingSession(status === 'loading');
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
                } finally {
                    setLoadingUser(false); // Set to false after user data is fetched
                }
            } else {
                setLoadingUser(false); // Set to false if no session is available
            }
        };

        if (session) {
            setUserData();
        } else {
            setLoadingUser(false); // Set to false if no session is available
        }
    }, [session]);

    useEffect(() => {
        const selectedOracle = oracles.some(oracle => oracle.selected);
        setOracleSelected(selectedOracle);
        setButtonText(selectedOracle ? "Interpret Dream" : "Journal Dream");
    }, [oracles]);

    useEffect(() => {
        const getEmotions = async () => {
            try {
                const res = await axios.get('api/emotions/getEmotions');
                setEmotions(res.data);
            } catch (error) {
                console.log('Error fetching emotions: ', error);
            } finally {
                setLoadingEmotions(false);
            }
        };

        const getOracles = async () => {
            try {
                const res = await axios.get('/api/oracles');
                setOracles(res.data.sort((a, b) => a.oracleID - b.oracleID));
            } catch (error) {
                console.log('Error fetching oracles: ', error);
            } finally {
                setLoadingOracles(false); // Set to false after oracles are fetched
            }
        };

        getOracles();
        getEmotions();
    }, [])

    useEffect(() => {
        const handleResize = () => {
            setProgressBarClass(window.innerWidth > 768 ? 'progress-bar-width-desktop' : 'progress-bar-width-mobile');
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (!loadingUser && 
            !loadingOracles && 
            !loadingEmotions && 
            !loadingSession && 
            !loadingDreamStreak
        ) {
            setLoading(false);
        }
    }, [loadingUser, loadingOracles, loadingEmotions, loadingSession, loadingDreamStreak]);

    useEffect(() => {
        const getUserDreamStreak = async () => {
            setLoadingDreamStreak(true);
            try {
                const res = await axios.get(`/api/dream/streak`, { params: { userID: user._id } });
                console.log("res dream streak: ", res);
                setDreamStreak(res.data.dreamStreak[0]);
            } catch (error) {
                console.log("Error fetching user dream streak: ", error);
            } finally {
                setLoadingDreamStreak(false);
            }
        }

        if (user) {
            getUserDreamStreak();
        }
        else {
            setLoadingDreamStreak(false);
        }
    }, [user])

    const handleSelectionChange = (selected, oracleID) => {
        setOracles(prev => {
            const updatedOracles = [...prev];
            const oracleIndex = updatedOracles.findIndex(oracle => oracle.oracleID === oracleID);
            updatedOracles[oracleIndex].selected = !selected;
            return updatedOracles;
        });
    };

    const journalDream = async () => {
        if (!dream) {
            setError("Please enter a dream");
            return;
        }
        setSavingDream(true);
        const userID = user?._id;
        try {
            const resJournal = await axios.post('/api/dream/journal', { userID, dream, interpretDream: oracleSelected, emotions: selectedEmotions });
            const dreamID = resJournal.data._id;
            setNewDreamID(dreamID);
            localStorage.setItem("dreamID", dreamID);
            if (oracleSelected) {
                interpretDreams(dreamID);
            } else {
                setJustJournal(true);
            }
        } catch (error) {
            setError("Error Journaling Dream");
            setSaveMessage("Error Journaling Dream. Please Try Again Later");
            setErrorWhileJournaling(true);
        }
    };


    const handleEmotionClick = (emotionId) => {
        setSelectedEmotions(prevSelectedEmotions => {
            if (!prevSelectedEmotions) prevSelectedEmotions = [];
            if (prevSelectedEmotions.includes(emotionId)) {
                return prevSelectedEmotions.filter(id => id !== emotionId);
            } else {
                return [...prevSelectedEmotions, emotionId];
            }
        });
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
        if (user?.name) {
            setSaveMessage(dreamID ? "Your dream has been saved and is currently being interpreted." : "Your dream is currently being interpreted.");
        }
        setInterpretingDream(true);

        let userDetails = [];

        if (user?.genderID) {
            const genderName = await getGenderName(user.genderID);
            if (genderName) {
                userDetails.push(`Gender: ${genderName}`);
            }
        }
        if (user?.age) {
            userDetails.push(`Age: ${user.age}`);
        }
        if (user?.culturalBackground) {
            userDetails.push(`Cultural Background: ${user.culturalBackground}`);
        }
        if (user?.spiritualPractices) {
            userDetails.push(`Spiritual Practices: ${user.spiritualPractices}`);
        }

        let additionalContext = '';
        if (userDetails.length > 0) {
            additionalContext = `\nIf provided, consider the following details about the dreamer to add context to the interpretation, but only if they are relevant to the dream: ${userDetails.join(', ')}. If these details do not seem relevant, feel free to disregard them.\n`;
        }

        for (let i = 0; i < oracles.length; i++) {
            if (oracles[i].selected) {
                try {
                    const dreamPrompt = `${oracles[i].prompt}${additionalContext}\nHere is the dream:\n###\n${dream}`;
                    const resInterpret = await axios.get('https://us-central1-dream-oracles.cloudfunctions.net/dreamLookup', { params: { dreamPrompt } });
                    const resUpdateDatabase = await axios.post('/api/dream/interpret', { dreamID, interpretation: resInterpret.data[0].message.content, oracleID: oracles[i].oracleID, user });
                    setInterpretationProgressArray(prevArray => {
                        const updatedArray = [...prevArray];
                        updatedArray[i] = 100;
                        return updatedArray;
                    });
                } catch (error) {
                    setError("Error Interpreting or Saving Interpretation");
                    setSaveMessage("Error Interpreting or Saving Interpretation. Please Try Again Later");
                    setErrorWhileJournaling(true);
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

    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
        }
    };

    const incrementDreamStep = () => {
        setDreamStep(prevStep => prevStep + 1);
    };
    
    const decrementDreamStep = () => {
        setDreamStep(prevStep => Math.max(prevStep - 1, 0)); // Ensure it doesn't go below 0
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
        <div className="text-white relative">
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
                    oracleSelected={oracleSelected}
                    errorWhileJournaling={errorWhileJournaling}
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
                    setDreamPublic={setDreamPublic}
                    dreamPublic={dreamPublic}
                    scrollLeft={scrollLeft}
                    scrollRight={scrollRight}
                    scrollContainerRef={scrollContainerRef}
                    emotions={emotions}
                    handleEmotionClick={handleEmotionClick}
                    selectedEmotions={selectedEmotions}
                    dreamStreak={dreamStreak}
                    dreamStep={dreamStep}
                    incrementDreamStep={incrementDreamStep}
                    decrementDreamStep={decrementDreamStep}
                    oracleSelected={oracleSelected}
                />
            )}
        </div>
    );
};

const SavingDreamView = ({
    saveMessage, 
    interpretingDream, 
    user, 
    resetPage, 
    justJournal, 
    goToDreamDetails, 
    oracles, 
    interpretationProgressArray, 
    progressBarClass,
    oracleSelected,
    errorWhileJournaling
}) => (
    <div className="flex justify-center main-content">
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
                        {!user ? (
                            <div>
                                <div className="golden-ratio-2 text-center font-bold text-gold">
                                    {oracleSelected ? (
                                        <p>Create an account below to view your dream interpretation</p>
                                    ) : (
                                        <p>Create an account below to start a dream journal</p>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div>
                                <button className="start-button" onClick={resetPage}>Journal New Dream</button>
                                {!justJournal && !errorWhileJournaling && <button className="start-button" onClick={goToDreamDetails}>Go To Dream Details</button>}
                            </div>
                        )}
                    </div>
                )}
            </div>
            {interpretingDream && !user?.name && (
                <div className="flex justify-center">
                    <div className="golden-ratio-2 text-center font-bold text-gold md:w-2/3 mx-5">
                        Create an account below to view your interpretation once it&apos;s ready
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
    user, 
    error, 
    dream, 
    setDream, 
    handleSelectionChange, 
    oracles, 
    journalDream, 
    buttonText, 
    scrollLeft,
    scrollRight,
    scrollContainerRef,
    emotions,
    handleEmotionClick,
    selectedEmotions,
    dreamStreak,
    dreamStep,
    setDreamStep,
    incrementDreamStep,
    decrementDreamStep,
    oracleSelected
}) => (
    <div className="flex justify-center items-center min-h-screen relative">
        {dreamStep === 0 ? (
            <div className="main-content overflow-y-auto h-screen">
                <WelcomeSection 
                    user={user} 
                    dreamStreak={dreamStreak} 
                    setDreamStep={setDreamStep} 
                    incrementDreamStep={incrementDreamStep} 
                />
            </div>
        ) : dreamStep === 1 ? (
            <div>
                <div className="back-button-container">
                    <button className="back-button golden-ratio-1" onClick={decrementDreamStep}>Back</button>
                </div>
                <ShareDreamSection 
                    error={error} 
                    dream={dream}
                    setDream={setDream} 
                    incrementDreamStep={incrementDreamStep}
                    decrementDreamStep={decrementDreamStep}
                />
            </div>
        ) : dreamStep === 2 ? (
            <div>
                <div className="back-button-container">
                    <button className="back-button golden-ratio-1" onClick={decrementDreamStep}>Back</button>
                </div>
                <MoodSection 
                    emotions={emotions} 
                    handleEmotionClick={handleEmotionClick} 
                    selectedEmotions={selectedEmotions} 
                    incrementDreamStep={incrementDreamStep}
                    decrementDreamStep={decrementDreamStep}
                />
            </div>
        ) : dreamStep === 3 ? (
            <div>
                <div className="back-button-container">
                    <button className="back-button golden-ratio-1" onClick={decrementDreamStep}>Back</button>
                </div>
                <OracleSelectionSection 
                    user={user} 
                    scrollLeft={scrollLeft} 
                    scrollContainerRef={scrollContainerRef} 
                    oracles={oracles} 
                    handleSelectionChange={handleSelectionChange} 
                    scrollRight={scrollRight} 
                    journalDream={journalDream} 
                    buttonText={buttonText} 
                    decrementDreamStep={decrementDreamStep}
                    oracleSelected={oracleSelected}
                />
            </div>
        ) : (<div></div>)}
    </div>
);

const WelcomeSection = ({ user, dreamStreak, incrementDreamStep }) => {
    return (
        <div>
            {user?.name ? (
                <WelcomeBackPageSection user={user} dreamStreak={dreamStreak} incrementDreamStep={incrementDreamStep} />
            ) : (
                <WelcomePageSection incrementDreamStep={incrementDreamStep} />
            )}
        </div>
    );
}

const WelcomeBackPageSection = ({ incrementDreamStep, dreamStreak, user }) => {
    return (
        <div className="title-container-alt">
            <div className="content-wrapper">
                <p className="text-center golden-ratio-5 gradient-title-text pb-2">Dream Oracles</p>
                <p className="text-center golden-ratio-2">Welcome back {user?.name}</p>
                {dreamStreak && dreamStreak.streakLength > 0 && (
                    <p className="text-center golden-ratio-2">{dreamStreak.streakLength} Day Dream Streak</p>
                )}
                <div className="button-container">
                    <button 
                        className={`start-button golden-ratio-1 ${!user?.activated ? 'disabled-button' : ''}`} 
                        onClick={user?.activated ? incrementDreamStep : null} 
                        disabled={!user?.activated}
                    >
                        New Dream
                    </button>
                </div>
                {!user?.activated && (
                    <div className="text-center text-gold golden-ratio-1 mt-5">
                        <p className="font-bold">
                            Please activate your account to continue. Check your email for the activation link.
                        </p>
                        <a href={`/emailVerification?email=${user?.email}`} className="underline">Didn&apos;t receive the verification email?</a>
                    </div>

                    )}
            </div>
            <div className="image-container text-center">
                <img src="/mandela.png" alt="Mandela" className="mandela-image" />
            </div>
        </div>
    );
};

const WelcomePageSection = ({ incrementDreamStep }) => {
    const titleRef = useRef(null);
    const descriptionRef = useRef(null);

    useEffect(() => {
        if (titleRef.current && descriptionRef.current) {
            const titleWidth = titleRef.current.offsetWidth;
            const adjustedWidth = titleWidth - 40; // Adjust the width to be smaller by 40px
            descriptionRef.current.style.width = `${adjustedWidth}px`;
        }
    }, []);

    const isMobile = window.innerWidth < 768;

    return (
        <div className="title-container">
            <p className="text-center golden-ratio-2">Welcome to</p>
            <p ref={titleRef} className="text-center golden-ratio-5 gradient-title-text pb-2">Dream Oracles</p>
            <p ref={descriptionRef} className="text-center golden-ratio-1 match-width">
                Find out what your dreams are trying to tell you with our intelligent dream interpretation AI models. All you have to do is follow the steps below:
            </p>
            {isMobile ? (
                <div className="image-container flex flex-col">
                    <div className="step-section-mobile border-bottom mb-4">
                        <img src="/ShareDreamStep.svg" alt="Step 1" className="step-image-mobile" />
                        <p className="golden-ratio-1 center-text">Step 1</p>
                        <p className="golden-ratio-2 center-text">Share your dream</p>
                        <p className="golden-ratio-1 center-text">Write down everything that you remember and try to include as many details as possible</p>
                    </div>
                    <div className="step-section-mobile border-bottom mb-4">
                        <img src="/OracleStep.svg" alt="Step 2" className="step-image-mobile" />
                        <p className="golden-ratio-1 center-text">Step 2</p>
                        <p className="golden-ratio-2 center-text">Choose an Oracle</p>
                        <p className="golden-ratio-1 center-text">Select a dream oracle, with each oracle being one of our intelligent AI interpretation models</p>
                    </div>
                    <div className="step-section-mobile">
                        <img src="/LearnStep.svg" alt="Step 3" className="step-image-mobile" />
                        <p className="golden-ratio-1 center-text">Step 3</p>
                        <p className="golden-ratio-2 center-text">Learn about your dream</p>
                        <p className="golden-ratio-1 center-text">Read a summary and discover detailed insights on your dream, while saving it all in your dream journal</p>
                    </div>
                </div>
            ) : (
                <div className="image-container flex flex-row">
                    <div className="step-section border-right mr-4">
                        <img src="/ShareDreamStep.svg" alt="Step 1" className="step-image" />
                        <p className="golden-ratio-1">Step 1:</p>
                        <p className="golden-ratio-2">Share your dream</p>
                        <p className="golden-ratio-1">Write down everything that you remember and try to include as many details as possible</p>
                    </div>
                    <div className="step-section border-right mr-4">
                        <img src="/OracleStep.svg" alt="Step 2" className="step-image" />
                        <p className="golden-ratio-1">Step 2:</p>
                        <p className="golden-ratio-2">Choose an Oracle</p>
                        <p className="golden-ratio-1">Select a dream oracle, with each oracle being one of our intelligent AI interpretation models</p>
                    </div>
                    <div className="step-section">
                        <img src="/LearnStep.svg" alt="Step 3" className="step-image" />
                        <p className="golden-ratio-1">Step 3:</p>
                        <p className="golden-ratio-2 reduce-line-spacing">Learn about your dream</p>
                        <p className="golden-ratio-1">Read a summary and discover detailed insights on your dream, while saving it all in your dream journal</p>
                    </div>
                </div>
            )}
            <div className="button-container">
                <button className="start-button golden-ratio-1" onClick={incrementDreamStep}>Start Now!</button>
            </div>
            <a href="/login" className="text-gold golden-ratio-1 underline">Already Have Account?</a>
            <div className="image-container text-center mt-4">
                <img src="/mandela.png" alt="Mandela" className="mandela-image" />
            </div>
        </div>
    );
};


const ShareDreamSection = ({ setDream, dream, error, incrementDreamStep }) => {
    return (
        <div>
            <HowItWorksPopup />
            <div className="flex flex-col items-center">
                <textarea
                    type="text"
                    rows={7}
                    placeholder='Dream goes here'
                    className="DreamBox golden-ratio-2 border-2 p-1 border-black rounded-lg text-black  md:m-0 m-2 w-full"
                    value={dream}
                    onChange={(event) => setDream(event.target.value)}
                />
            </div>
            {error && <div className="bg-red-500 w-max p-1 text-black font-bold rounded-xl whitespace-nowrap">{error}</div>}
            <div className="button-container">
                <button
                    className={`start-button golden-ratio-1 ${!dream.trim() ? 'disabled-button' : ''}`}
                    onClick={incrementDreamStep}
                    disabled={!dream.trim()}
                >
                    Continue
                </button>
            </div>
        </div>
    )
}

const HowItWorksPopup = () => {

    const isMobile = window.innerWidth < 768;

    return (
        <div className="justify-center golden-ratio-3 text-center px-1">
            <div className="flex flex-col justify-center items-center golden-ratio-2">
                <p className={`gradient-title-text ${isMobile ? 'golden-ratio-4' : 'golden-ratio-5'}`}>Share Your Dream</p>
            </div>
            <div className="inline-flex items-center">
                <p className="golden-ratio-2 mb-3">Write down everything that you remember and try to include as many details as possible</p>
                {/* <InfoPopup 
                    icon={faQuestionCircle} 
                    infoTitle="Describe your dream"
                    infoText="When entering your dream description into our Dream Interpretation application, focus on including as many details as possible. Instead of using people's names, describe their relationship to you (e.g., 'my friend,' 'a family member'). Additionally, mention significant settings and any notable symbols or events to provide a comprehensive and insightful interpretation." 
                /> */}
            </div>
        </div>
    )
};


const MoodSection = ({ emotions, handleEmotionClick, selectedEmotions, incrementDreamStep }) => {
    return (
        <div id="mood-selection-section">
            <MoodSelectionPopup />
            <div className="flex flex-wrap gap-2 justify-center md:w-3/4 md:mx-auto">
                {emotions.map(emotion => (
                    <button 
                        key={emotion.emotionID} 
                        onClick={() => handleEmotionClick(emotion.emotionID)} 
                        className={`px-4 py-2 rounded-lg transition text-black ${selectedEmotions?.includes(emotion.emotionID) ? 'border-4 border-gold bg-gray-400 hover:bg-gray-200' : 'bg-gray-200 hover:bg-gray-400'}`}
                    >
                        {emotion.emotionName}
                    </button>
                ))}
            </div>
            <div className="button-container">
                <button className="start-button golden-ratio-1" onClick={incrementDreamStep}>Continue</button>
            </div>
        </div>
    )
}

const MoodSelectionPopup = () => {

    const isMobile = window.innerWidth < 768;

    return (
        <div className="justify-center golden-ratio-3 text-center px-1">
            <div className="flex flex-col justify-center items-center">
                <p className={`gradient-title-text ${isMobile ? 'golden-ratio-4' : 'golden-ratio-5'}`}>Mood Board</p>
            </div>
            <div className="inline-flex items-center">
                <p className="golden-ratio-2 mb-7">What emotions did you experience during and after your dream? (optional)</p>
                {/* <InfoPopup 
                    icon={faQuestionCircle} 
                    infoTitle="How Did Your Dream Feel?"
                    infoText="Select any feelings you might have felt during the dream or upon waking from the dream. These can help bring more context into your interpretation, as our emotions play a huge role in understanding our dreams" 
                /> */}
            </div>
        </div>
    )
}

const OracleSelectionSection = ({ 
    user, 
    scrollLeft, 
    scrollContainerRef, 
    oracles, 
    handleSelectionChange, 
    scrollRight, 
    journalDream, 
    buttonText,
    oracleSelected
}) => {

    const isButtonDisabled = (!user?.activated && user?.name) || (!oracleSelected && !user?.name);

    return (
        <div id="interpretation-section" className="relative">
            <OracleSelectionPopup credits={user?.credits} />
            <div className="flex items-center justify-center relative">
                <button onClick={scrollLeft} className="absolute left-0 z-10 p-2 bg-white bg-opacity-25 rounded-full shadow-md hover:bg-opacity-50 md:hidden">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                    </svg>
                </button>
                <div ref={scrollContainerRef} className="flex overflow-x-auto scroll-smooth scrollbar-hide md:overflow-x-visible md:flex-row">
                    {oracles.filter(oracle => oracle.active).map((oracle) => (
                        <div key={oracle._id} className="flex-none mx-2 md:flex-auto">
                            <OracleSection oracle={oracle} handleSelectionChange={handleSelectionChange} />
                        </div>
                    ))}
                </div>
                <button onClick={scrollRight} className="absolute right-0 z-10 p-2 bg-white bg-opacity-25 rounded-full shadow-md hover:bg-opacity-50 md:hidden">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                </button>
            </div>
            <div className="flex flex-col items-center">
                <button
                    className={`start-button ${isButtonDisabled ? 'disabled-button' : ''}`}
                    onClick={journalDream}
                    disabled={isButtonDisabled}
                >
                    {buttonText}
                </button>
                {!user?.activated && user?.name && (
                    <a className="text-gold golden-ratio-1 underline cursor-pointer" href={`/emailVerification?email=${user?.email}`}>Finish registering your account to continue</a>
                )}
            </div>
        </div>
    )
}

const OracleSelectionPopup = ({ credits }) => {

    const isMobile = window.innerWidth < 768;

    return (
        <div className="justify-center golden-ratio-3 text-center px-1">
            <div className="flex flex-col justify-center items-center golden-ratio-2">
                <p className={`gradient-title-text ${isMobile ? 'golden-ratio-4' : 'golden-ratio-5'}`}>Choose an Oracle</p>
            </div>
            <div className="inline-flex items-center">
                <p className="golden-ratio-2 mb-3">Select a Dream Oracle, with each oracle being one of our intelligent AI interpretation models</p>
                {/* <InfoPopup 
                    icon={faQuestionCircle} 
                    infoTitle="Choosing a Dream Oracle"
                    infoText="Here, you can select as many oracles as you would like to interpret your dreams. The more Dream Oracles you select, the longer it will take to interpret your dream. Click on the info icon next to each oracle to learn about their interpretation style." 
                /> */}
            </div>
        </div>
    )
}

export default JournalForm;
