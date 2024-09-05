"use client";
import React, { useState, useEffect, lazy } from 'react';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import axios from 'axios';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import EditDreamModal from './EditDreamModal';
import OracleInterpretations from './OracleInterpretations';
import AddNewInterpretationModal from './AddNewInterpretationModal';
import SymbolCard from './SymbolCard';

const LoadingComponent = lazy(() => import('../LoadingComponent'));

export default function DreamsForm() {

    const { data: session } = useSession();

    const searchParams = useSearchParams();
    const dreamID = searchParams.get('dreamID');
    const router = useRouter();

    const [user, setUser] = useState(null);
    
    const [loadingUser, setLoadingUser] = useState(true);
    const [loading, setLoading] = useState(true);

    const [dreamEmotions, setDreamEmotions] = useState([]);
    const [emotions, setEmotions] = useState([]);
    const [dream, setDream] = useState(null);
    const [interpretations, setInterpretations] = useState(null);
    const [oracles, setOracles] = useState(null);
    const [dreamSymbols, setDreamSymbols] = useState([]);
    const [userDreamSymbols, setUserDreamSymbols] = useState([]);

    const [isDreamExpanded, setIsDreamExpanded] = useState(false);

    // modals
    const [showAddNewInterpretationModal, setShowAddNewInterpretationModal] = useState(false);
    const [showEditDreamModal, setShowEditDreamModal] = useState(false);

    const handleToggleDreamExpanded = () => {
        setIsDreamExpanded(!isDreamExpanded);
    }

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
                    setLoadingUser(false);
                }
            } else {
                setLoadingUser(false);
            }
        };

        if (session) {
            setUserData();
        } else {
            setLoadingUser(false);
        }
    }, [session]);

    useEffect(() => {
        const handleGoogleSignUp = async () => {
            const dreamID = localStorage.getItem('dreamID');
            let googleSignUp = localStorage.getItem('googleSignUp');
            googleSignUp = (googleSignUp === 'true');
            if (dreamID && googleSignUp) {
                localStorage.setItem('googleSignUp', false);
                const userID = user._id;
                await axios.post('/api/user/sendWelcomeEmail', {
                    email: user?.email,
                    name: user?.name
                })
                await axios.post('api/dream/newUser', { userID, dreamID, googleSignUp: true });
                await axios.post('/api/dream/streak/newStreak', { userID });
            }
        }

        if (user?._id) {
            handleGoogleSignUp();
        }
    }, [user])

    useEffect(() => {
        const checkPage = () => {
            if (!dreamID) {
                router.push('/interpret');
            }
        }

        const getUser = async () => {
            try {
                const userDetails = await axios.get("/api/dream/getUser/" + dreamID);
                setUser(userDetails.data.user);
            } catch (error) {
                console.error("Error fetching user details:", error);
            } finally {
                setLoadingUser(false); // Set to false after user data is fetched
            }
        }

        const getEmotions = async () => {
            try {
                const resEmotions = await axios.get("/api/emotions/getEmotions");
                console.log("Here are the emotions: ", resEmotions.data);
                setEmotions(resEmotions.data);
            } catch (error) {
                console.log("Error fetching emotions: ", error);
            }
        }

        const getOracles = async () => {
            try {
                const resOracles = await axios.get("/api/allOracles");
                console.log("Here are the oracles: ", resOracles.data);
                setOracles(resOracles.data);
            } catch (error) {
                console.log("There was an error fetching the dream oracles: ", error);
            }
        }

        checkPage();
        getUser();
        getEmotions();
        getOracles();
    }, [])

    useEffect(() => {
        const fetchDreamEmotions = async () => {
            try {
                const res = await axios.get(`/api/emotions/getDreamEmotions?dreamID=${dreamID}`);
                setDreamEmotions(res.data);
            } catch (error) {
                console.log('Error fetching dream emotions:', error);
            }
        };

        const fetchUserDreamSymbols = async () => {
            try {
                const res = await axios.get(`/api/dream/userDreamSymbols?dreamID=${dreamID}`);
                console.log("user dream symbols: ", res);
                setUserDreamSymbols(res.data);
            } catch (error) {
                console.log("There was an error fetching the user dream symbols: ", error);
            }
        }

        if (dreamID) {
            fetchDreamEmotions();
            fetchUserDreamSymbols();
        }
    }, [dreamID]);

    useEffect(() => {
        const getDreamDetails = async () => {
            try {
                const dreamRes = await axios.get('/api/dream/' + dreamID);
                setDream(dreamRes.data.dream);
                setInterpretations(dreamRes.data.interpretations);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching dream details:", error);
            }
        };

        if (dreamID) {
            getDreamDetails();
        }
    }, [dreamID]);

    useEffect(() => {
        if (!loadingUser) {
            setLoading(false); // Set loading to false only after all data is fetched
        }
    }, [loadingUser]);

    const backToDreams = () => {
        router.push('/dreams');
    }

    const getEmotionEmoji = (emotionID) => {
        const emotion = emotions.find(e => e.emotionID === emotionID);
        return emotion ? emotion.emotionEmoji : '';
    };

    const sliceDream = (dream) => {
        if (dream.length <= 100 || isDreamExpanded) {
          // If the dream is short or expanded, return the full dream
          return dream;
        }
    
        // Slice up to 100 characters, find the last space to avoid cutting a word
        const slicedDream = dream.slice(0, 100);
        const lastSpaceIndex = slicedDream.lastIndexOf(' ');
    
        // Return the dream sliced up to the last space with "... more" wrapped in a span
        return (
            <>
                {dream.slice(0, lastSpaceIndex)}
                <span onClick={handleToggleDreamExpanded} className="text-gray-300 cursor-pointer">
                    {" "}...view more
                </span>
            </>
        );
    };

    const handleSaveDream = (updatedDreamText) => {
        setDream((prev) => ({...prev, dream: updatedDreamText}));
    }

    const handleInterpretDream = () => {
        console.log("interpreting the dream...");
    }

    if (loading || !dream) {
        return (
            <LoadingComponent loadingText={'Collecting Dream Details'} />
        );
    }

    return (
        <div className="main-content">
            <div className="flex flex-col mb-10 text-white md:w-6/12 mx-auto p-2">
                <p className='golden-ratio-1 mb-0 text-gold'>Interpretations</p>
                <div className="flex flex-row">
                    {interpretations.map((interpretation) => {
                        const oracle = oracles.find((oracle) => oracle.oracleID === interpretation.oracleID);

                        return (
                            <OracleInterpretations
                                key={interpretation.oracleID}
                                interpretation={interpretation}
                                oracle={oracle}
                            />
                        );
                    })}
                    <div className="flex flex-col cursor-pointer p-2" onClick={() => setShowAddNewInterpretationModal(true)}>
                        <div className="w-14 h-14 rounded-full border-gold-small flex items-center justify-center bg-black bg-opacity-50">
                        <span className="text-xl font-bold text-gold">+</span>
                        </div>
                        <p className="mt-2 text-sm text-gold">Add New</p>
                    </div>
                </div>
                <div className="relative flex flex-col md:flex-row">
                    <div className="w-full md:w-2/3 h-full md:h-auto">
                        {dream.imageURL ? (
                            <Image 
                                src={dream.imageURL} 
                                alt="the dream image" 
                                className="w-full h-full rounded-lg"
                                width={500} // Adjust to your preferred fixed width
                                height={500} // Adjust to your preferred fixed height
                                unoptimized={true}
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center border-2 border-dashed rounded-lg">
                                <span className="text-gray-500">+ Add Picture</span>
                            </div>
                        )}
                    </div>
                    <div className="w-full md:w-1/3 md:pl-4 mt-4 md:mt-0 mb-4">
                        <h3 className="text-xl font-bold text-white">Dream Themes</h3>
                        <div className="flex flex-wrap gap-4 mt-4">
                            {userDreamSymbols && userDreamSymbols.length > 0 ? (
                                userDreamSymbols.map((symbol, index) => (
                                    <SymbolCard key={index} symbol={symbol} />
                                ))
                            ) : (
                                <div className="p-4 bg-gradient-to-r from-gray-700 to-gray-900 rounded-lg shadow-lg text-white text-center">
                                    No symbols found
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div>
                    <p className='golden-ratio-2 px-1'>{isDreamExpanded ? dream.dream : sliceDream(dream.dream)}</p>
                    <div className='flex flex-wrap gap-2'>
                        {dreamEmotions.map((emotion) => (
                            <div 
                                key={emotion._id} 
                                className=""
                            >
                                {getEmotionEmoji(emotion.emotionID)}
                            </div>
                        ))}
                    </div>
                    <p className="golden-ratio-2 text-right cursor-pointer" onClick={() => setShowEditDreamModal(true)}>
                        Edit Dream <FontAwesomeIcon icon={faPencil} className="cursor-pointer golden-ratio-2" />
                    </p>
                </div>
            </div>
            <EditDreamModal
                dream={dream}
                isOpen={showEditDreamModal}
                onClose={() => setShowEditDreamModal(false)}
                onSave={handleSaveDream}
            />
            <AddNewInterpretationModal
                oracles={oracles}
                isOpen={showAddNewInterpretationModal}
                onClose={() => setShowAddNewInterpretationModal(false)}
                onInterpret={handleInterpretDream}
            />
        </div>
    );
}