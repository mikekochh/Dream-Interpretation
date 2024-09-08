"use client";
import React, { useState, useEffect, useRef, lazy, Suspense, useContext } from 'react';
import axios from 'axios';
import { UserContext } from "@/context/UserContext";
import { useRouter } from 'next/navigation';

const SavingDreamView = lazy(() => import('./mainPage/SavingDreamView'));
const JournalDreamView = lazy(() => import('./mainPage/JournalDreamView'));
const LoadingComponent = lazy(() => import('./LoadingComponent'));

const JournalForm = () => {
    const { user } = useContext(UserContext)

    const router = useRouter();

    const [savingDream, setSavingDream] = useState(false);
    const [oracles, setOracles] = useState([]);
    const [buttonText, setButtonText] = useState("Journal Dream");
    const [saveMessage, setSaveMessage] = useState("");
    const [oracleSelected, setOracleSelected] = useState(false);
    const [dream, setDream] = useState("");
    const [interpretationComplete, setInterpretationComplete] = useState(false);

    const [loading, setLoading] = useState(true);
    const [loadingSession, setLoadingSession] = useState(true);
    const [loadingOracles, setLoadingOracles] = useState(true);
    const [loadingEmotions, setLoadingEmotions] = useState(true);
    const [loadingDreamStreak, setLoadingDreamStreak] = useState(true);

    const [dreamPublic, setDreamPublic] = useState(false);
    const [emotions, setEmotions] = useState([]);
    const [selectedEmotions, setSelectedEmotions] = useState([]);
    const [dreamStreak, setDreamStreak] = useState();

    const [dreamStep, setDreamStep] = useState(0);

    const scrollContainerRef = useRef(null);

    useEffect(() => {
        setLoadingSession(status === 'loading');
    }, [status]);

    useEffect(() => {
        const selectedOracle = oracles.some(oracle => oracle.selected);
        setOracleSelected(selectedOracle);
        setButtonText(selectedOracle ? "Interpret Dream" : "Journal Dream");
    }, [oracles]);

    // if google sign up is true, send users to a new page
    useEffect(() => {
        const checkGoogleSignUp = () => {
            const dreamID = localStorage.getItem('dreamID');
            let googleSignUp = localStorage.getItem('googleSignUp');
            googleSignUp = (googleSignUp === 'true');
            if (dreamID && googleSignUp) {
                router.push('/dreamDetails?dreamID=' + dreamID);
            }
        }

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

        checkGoogleSignUp();
        getOracles();
        getEmotions();
    }, [])

    useEffect(() => {
        if (!loadingOracles &&
            !loadingEmotions &&
            !loadingSession &&
            !loadingDreamStreak
        ) {
            setLoading(false);
        }
    }, [loadingOracles, loadingEmotions, loadingSession, loadingDreamStreak]);

    useEffect(() => {
        const getUserDreamStreak = async () => {
            setLoadingDreamStreak(true);
            try {
                const res = await axios.get(`/api/dream/streak`, { params: { userID: user._id } });
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

    const selectOracle = (oracleID) => {
        setOracles(prev => {
            const updatedOracles = [...prev];
            const oracleIndex = updatedOracles.findIndex(oracle => oracle.oracleID === oracleID);
            updatedOracles[oracleIndex].selected = true;
            return updatedOracles;
        });
    }

    const journalDream = async () => {
        setSavingDream(true);
        const userID = user?._id;
        try {
            setSaveMessage("Journaling Dream");
            const resJournal = await axios.post('/api/dream/journal', { userID, dream, interpretDream: oracleSelected, emotions: selectedEmotions });
            const dreamID = resJournal.data._id;
            localStorage.setItem("dreamID", dreamID);
            const resSummarizeDream = await axios.get('https://us-central1-dream-oracles.cloudfunctions.net/dreamSummary',
                {
                    params: {
                        dream: dream
                    }
                }
            )
            setSaveMessage("Generating Dream Image");
            const dreamSummary = resSummarizeDream.data[0].message.content;
            const resDrawDream = await axios.post('https://us-central1-dream-oracles.cloudfunctions.net/generateDreamImage', 
                { 
                    dreamID: dreamID, 
                    dream: dreamSummary 
                }
            );
            setSaveMessage("Uncovering Dream Symbols");
            const resDreamSymbols = await axios.get('https://us-central1-dream-oracles.cloudfunctions.net/dreamSymbols', 
                { 
                    params: { 
                        dreamText: dream, 
                        dreamID: dreamID, 
                        userID: userID 
                    } 
                }
            );
            if (oracleSelected) {
                await interpretDreams(dreamID);
            }
            if (user) {
                setSaveMessage("Dream interpretation complete! Taking you to your personalized Dream Page");
                // if they do not have an account, they need to create one to see their interpretation. do not take them straight to in this case
                setTimeout(() => {
                    router.push('/dreamDetails?dreamID=' + dreamID);
                }, 3000);
            }
            else {
                setSaveMessage("Dream interpretation complete! Please create an account to continue");
                setInterpretationComplete(true);
            }
        } catch (error) {
            console.log("the error: ", error);
            setSaveMessage("Error Journaling Dream. Please Try Again Later");
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
        let userDetails = [];
        let additionalContext = '';

        if (user) {
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
            if (userDetails.length > 0) {
                additionalContext = `\nIf provided, consider the following details about the dreamer to add context to the interpretation, but only if they are relevant to the dream: ${userDetails.join(', ')}. If these details do not seem relevant, feel free to disregard them.\n`;
            }
        }

        for (let i = 0; i < oracles.length; i++) {
            if (oracles[i].selected) {
                try {
                    const dreamPrompt = `${oracles[i].prompt}${additionalContext}\nHere is the dream:\n###\n${dream}`;
                    setSaveMessage(oracles[i].oracleName + " is now interpreting your dream");
                    await axios.get('https://us-central1-dream-oracles.cloudfunctions.net/dreamLookup', { params: { dreamPrompt, dreamID, oracleID: oracles[i].oracleID } });
                } catch (error) {
                    setSaveMessage("Error Interpreting or Saving Interpretation. Please Try Again Later");
                    console.log("error:", error);
                    return;
                }
            }
        }
        setSaveMessage(user?._id ? "Dream interpretation complete! You can now view your dream interpretation under the dream details page." : "Dream interpretation complete!");
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
            <LoadingComponent loadingText={'Assembling the Dream Oracles'} />
        );
    }

    return (
        <Suspense fallback={<LoadingComponent loadingText={'Assembling the Dream Oracles'} /> }>
            <div className="text-white relative">
                {savingDream ? (
                    <SavingDreamView saveMessage={saveMessage} user={user} interpretationComplete={interpretationComplete} />
                ) : (
                    <JournalDreamView
                        user={user}
                        dream={dream}
                        setDream={setDream}
                        handleSelectionChange={handleSelectionChange}
                        selectOracle={selectOracle}
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
        </Suspense>
    );
};

export default JournalForm;
