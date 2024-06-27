"use client";
import React, { useState, useEffect, useRef, lazy } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
const SavingDreamView = lazy(() => import('./mainPage/SavingDreamView'))
const JournalDreamView = lazy(() => import('./mainPage/JournalDreamView'))

const JournalForm = () => {
    const { data: session, status } = useSession();
    const [user, setUser] = useState(null);
    const [error, setError] = useState(false);
    const [savingDream, setSavingDream] = useState(false);
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
                    setDreamStep={setDreamStep}
                />
            )}
        </div>
    );
};

export default JournalForm;
