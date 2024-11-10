"use client";
import React, { useState, useEffect, useRef, lazy, Suspense, useContext } from 'react';
import axios from 'axios';
import { UserContext } from "@/context/UserContext";
import { PAGE_INTERPRET_HOME } from '@/types/pageTypes';
import { SIGN_UP_TYPE_DREAM_REMINDER_GOOGLE } from '@/types/signUpTypes';

const SavingDreamView = lazy(() => import('./mainPage/SavingDreamView'));
const JournalDreamView = lazy(() => import('./mainPage/JournalDreamView'));
const LoadingComponent = lazy(() => import('./LoadingComponent'));
const QuestionsForm = lazy(() => import('./mainPage/QuestionsForm'));

const InterpretForm = () => {
    const { user, userLoading, setUserData } = useContext(UserContext);

    const [savingDream, setSavingDream] = useState(false);
    const [oracles, setOracles] = useState([]);
    const [buttonText, setButtonText] = useState("Journal Dream");
    const [saveMessage, setSaveMessage] = useState("");
    const [oracleSelected, setOracleSelected] = useState(false);
    const [selectedOracleID, setSelectedOracleID] = useState(0);
    const [dream, setDream] = useState("");
    const [dreamID, setDreamID] = useState();

    const [loading, setLoading] = useState(true);
    const [loadingOracles, setLoadingOracles] = useState(true);
    const [loadingEmotions, setLoadingEmotions] = useState(true);
    const [loadingDreamStreak, setLoadingDreamStreak] = useState(true);

    const [emotions, setEmotions] = useState([]);
    const [selectedEmotions, setSelectedEmotions] = useState([]);
    const [dreamStreak, setDreamStreak] = useState();

    const [dreamQuestions, setDreamQuestions] = useState([]);
    const [continueToQuestions, setContinueToQuestions] = useState(false);

    const [dreamStep, setDreamStep] = useState(0);

    const scrollContainerRef = useRef(null);

    const [countedView, setCountedView] = useState(false);

    useEffect(() => {
        const addView = async () => {
            const referrer = document.referrer;
            const isFromInstagram = referrer.includes('instagram.com');
    
            if (window.location.hostname !== 'localhost') {
                await axios.post('/api/views/addView', {
                    pageID: PAGE_INTERPRET_HOME,
                    userID: user?._id,
                    isFromInstagram // Send the Instagram referrer boolean
                });
                setCountedView(true);
            }
        }
    
        if (!userLoading && !countedView) {
            addView();
        }
    }, [userLoading]);    
    

    useEffect(() => {
        const selectedOracle = oracles.some(oracle => oracle.selected);
        setOracleSelected(selectedOracle);
        setButtonText(selectedOracle ? "Interpret Dream" : "Journal Dream");
    }, [oracles]);

    // if google sign up is true, send users to a new page
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
        if (!loadingOracles &&
            !loadingEmotions &&
            !loadingDreamStreak
        ) {
            setLoading(false);
        }
    }, [loadingOracles, loadingEmotions, loadingDreamStreak]);

    useEffect(() => {
        const checkGoogleSignUp = async () => {
            const dreamID = localStorage.getItem('dreamID');
            let googleSignUp = localStorage.getItem('googleSignUp');
            googleSignUp = (googleSignUp === 'true');
            let googleReminder = localStorage.getItem('googleReminder');
            googleReminder = (googleReminder === 'true');
            if (dreamID && googleSignUp) {
                const userID = user?._id;
                await axios.post('/api/user/sendWelcomeEmail', {
                    email: user?.email,
                    name: user?.name
                })
                await axios.post('api/dream/newUser', { userID, dreamID, googleSignUp: true });
                journalDream();
            } else if (googleSignUp && googleReminder) {
                const userID = user?._id;
                await axios.post('/api/user/sendDreamReminder', { userID, signUpTypeID: SIGN_UP_TYPE_DREAM_REMINDER_GOOGLE });
                localStorage.setItem('googleReminder', false);
                setUserData();
            }
        }

        const checkRegisteredAccount = async () => {
            const existingDreamID = localStorage.getItem('dreamID');
            let googleSignUp = localStorage.getItem('googleSignUp');
            googleSignUp = (googleSignUp === 'true');
            if (existingDreamID && !googleSignUp) {
                journalDream();
            }
        }

        if (!loading && user) {
            checkRegisteredAccount();
            checkGoogleSignUp();
        }
    }, [loading, user])

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
        setSelectedOracleID(oracleID);
        setOracles(prev => {
            const updatedOracles = prev.map(oracle => ({
                ...oracle,
                selected: oracle.oracleID === oracleID ? !selected : false, // Deselect others, select only the clicked oracle
            }));
            return updatedOracles;
        });
    };    

    const selectOracle = (oracleID) => {
        setSelectedOracleID(oracleID);
        setOracles(prev => {
            const updatedOracles = [...prev];
            const oracleIndex = updatedOracles.findIndex(oracle => oracle.oracleID === oracleID);
            updatedOracles[oracleIndex].selected = true;
            return updatedOracles;
        });
    }

    const journalDream = async () => {
        setSavingDream(true);
        setSaveMessage("Generating Questions");
        const userID = user?._id;
        let localOracleSelected = oracleSelected;  // Create a local variable
        let existingDream = dream;
    
        try {
            let localDreamID;
            const existingDreamID = localStorage.getItem('dreamID');
            localStorage.removeItem('dreamID');
            localStorage.removeItem('googleSignUp');
            if (!existingDreamID) {
                const resJournal = await axios.post('/api/dream/journal', { userID, dream, interpretDream: oracleSelected, emotions: selectedEmotions });
                localDreamID = resJournal.data._id;
            } else {
                localDreamID = existingDreamID;
                
                // if there is an existing dream, we need to update the userID for that dream in the database
                const resUpdateDreamUserID = await axios.post('api/dream/updateUserID', {
                    userID,
                    dreamID: localDreamID
                });
                
                selectOracle(1); // this means they do not have an account, so must be jung interpretation
                setOracleSelected(true);
                localOracleSelected = true;  // Update local variable immediately
                const resGetDream = await axios.get('/api/dream/' + localDreamID);
                existingDream = resGetDream.data.dream.dream;
                setDream(existingDream);
            }

            setDreamID(localDreamID);

            // Generate Questions
            const resQuestions = await axios.get('https://us-central1-dream-oracles.cloudfunctions.net/dreamQuestions',
                {
                    params: {
                        dream: dream ? dream : existingDream,
                        oracleID: selectedOracleID
                    }
                }
            );

            setDreamQuestions(resQuestions.data);
    
            // Summarize the dream
            const resSummarizeDream = await axios.get('https://us-central1-dream-oracles.cloudfunctions.net/dreamSummary',
                {
                    params: {
                        dream: dream ? dream : existingDream
                    }
                }
            );
            const dreamSummary = resSummarizeDream.data[0].message.content;
    
            // Try generating the dream image, but don't break the flow if it fails
            setSaveMessage("Generating Dream Image");
            try {
                const resDrawDream = await axios.post('https://us-central1-dream-oracles.cloudfunctions.net/generateDreamImage', 
                    { 
                        dreamID: localDreamID, 
                        dream: dreamSummary 
                    }
                );
            } catch (error) {
                console.log("Error generating dream image, continuing without image.");
            }
    
            // Uncovering Dream Symbols
            setSaveMessage("Uncovering Dream Symbols");
            const resDreamSymbols = await axios.get('https://us-central1-dream-oracles.cloudfunctions.net/dreamSymbols', 
                { 
                    params: { 
                        dreamText: dream ? dream : existingDream, 
                        dreamID: localDreamID, 
                        userID: userID 
                    } 
                }
            );
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
            <LoadingComponent loadingText={'Preparing the Dream Oracles'} />
        );
    }

    return (
        <Suspense fallback={<div /> }>
            <div className="text-white relative">
                {dreamQuestions.length > 0 && continueToQuestions ? (
                    <QuestionsForm 
                        dreamQuestions={dreamQuestions} 
                        dreamID={dreamID}
                        oracleID={selectedOracleID}
                    />
                ) : savingDream ? (
                    <SavingDreamView 
                        saveMessage={saveMessage} 
                        setContinueToQuestions={setContinueToQuestions} 
                        questionsReady={dreamQuestions.length > 0}
                    />
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

export default InterpretForm;
