"use client";
import React, { useState, useEffect, useRef, lazy, Suspense, useContext } from 'react';
import axios from 'axios';
import { UserContext } from "@/context/UserContext";
import { PAGE_INTERPRET_HOME, PAGE_INTERPRET_LOADING, PAGE_INTERPRET_ORACLE } from '@/types/pageTypes';
import { SIGN_UP_TYPE_DREAM_REMINDER_GOOGLE } from '@/types/signUpTypes';
import { useRouter } from 'next/navigation';

const JournalDreamView = lazy(() => import('./mainPage/JournalDreamView'));
const LoadingComponent = lazy(() => import('./LoadingComponent'));
import PublicDreamView from './mainPage/PublicDreamView';


const InterpretForm = () => {
    const { user, setUserData, handleChangeSection } = useContext(UserContext);
    const router = useRouter();

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
    const [loadingDreamStreak, setLoadingDreamStreak] = useState(true);

    const [dreamStreak, setDreamStreak] = useState();

    const [dreamStep, setDreamStep] = useState(0);

    const scrollContainerRef = useRef(null);

    useEffect(() => {
        const selectedOracle = oracles.some(oracle => oracle.selected);
        setOracleSelected(selectedOracle);
        setButtonText(selectedOracle ? "Interpret Dream" : "Journal Dream");
    }, [oracles]);

    // if google sign up is true, send users to a new page
    useEffect(() => {
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
    }, [])

    useEffect(() => {
        if (!loadingOracles && !loadingDreamStreak) {
            setLoading(false);
        }
    }, [loadingOracles, loadingDreamStreak]);

    useEffect(() => {
        const checkGoogleSignUp = async () => {
            const dreamID = localStorage.getItem('dreamID');
            let googleSignUp = localStorage.getItem('googleSignUp');
            googleSignUp = (googleSignUp === 'true');
            if (dreamID && googleSignUp) {
                const userID = user?._id;
                await axios.post('/api/user/sendWelcomeEmail', {
                    email: user?.email,
                    name: user?.name
                })
                await axios.post('api/dream/newUser', { userID, dreamID, googleSignUp: true });
                journalDream();
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
        handleChangeSection(PAGE_INTERPRET_LOADING);
        setSavingDream(true);
        setSaveMessage("Interpreting Your Dream");
        const userID = user?._id;
        let existingDream = dream;
    
        try {
            let localDreamID;
            const existingDreamID = localStorage.getItem('dreamID');
            localStorage.removeItem('dreamID');
            localStorage.removeItem('googleSignUp');
            if (!existingDreamID) {
                const resJournal = await axios.post('/api/dream/journal', { userID, dream, interpretDream: oracleSelected });
                localDreamID = resJournal.data._id;
                setDreamID(localDreamID);
            } else {
                localDreamID = existingDreamID;
                setDreamID(localDreamID);
                
                // if there is an existing dream, we need to update the userID for that dream in the database
                await axios.post('api/dream/updateUserID', {
                    userID,
                    dreamID: localDreamID
                });
                
                selectOracle(1); // this means they do not have an account, so must be jung interpretation
                setOracleSelected(true);
                const resGetDream = await axios.get('/api/dream/' + localDreamID);
                existingDream = resGetDream.data.dream.dream;
                setDream(existingDream);
            }

            /// Interpret dream
            const resInterpretDream = await axios.post('https://us-central1-dream-oracles.cloudfunctions.net/dreamLookup',
                {
                    dream: dream ? dream : existingDream,
                    dreamID: localDreamID,
                    oracleID: selectedOracleID
                }
            )

            router.push('/dream-details?dreamID=' + localDreamID + "&openInterpretation=true");
        } catch (error) {
            console.log("the error: ", error);
            setSaveMessage("Error Interpretating Dream. Please Try Again Later");
        }
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
        setDreamStep(prevStep => {
            handleChangeSection(PAGE_INTERPRET_ORACLE);
            return prevStep + 1;
        });
    };

    const decrementDreamStep = () => {
        setDreamStep(prevStep => {
            handleChangeSection(PAGE_INTERPRET_HOME);
            return Math.max(prevStep - 1, 0);
        })
    };

    if (loading) {
        return (
            <LoadingComponent loadingText={'Preparing the Dream Oracles'} />
        );
    }

    return (
        <Suspense fallback={<div /> }>
            <div className="text-white relative">
                {savingDream ? (
                    <div class="flex flex-col items-center justify-center min-h-screen">
                        <PublicDreamView dreamID={dreamID}/>
                        <LoadingComponent loadingText={saveMessage} altScreen={true}/>
                    </div>
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
                        dreamStreak={dreamStreak}
                        dreamStep={dreamStep}
                        incrementDreamStep={incrementDreamStep}
                        decrementDreamStep={decrementDreamStep}
                        selectedOracle={selectedOracleID}
                    />
                )}
            </div>
        </Suspense>
    );
};

export default InterpretForm;
