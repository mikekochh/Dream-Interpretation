"use client";
import React, { useState, useEffect, useRef, lazy, useContext } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { LockClosedIcon, GlobeAltIcon } from '@heroicons/react/24/solid';

import { UserContext } from '@/context/UserContext';

import axios from 'axios';
import { faPencil, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import EditDreamModal from './EditDreamModal';
import DeleteDreamModal from './DeleteDreamModal';
import DreamSettingsModal from './DreamSettingsModal';
import OracleInterpretations from './OracleInterpretations';
import SymbolCard from './SymbolCard';
import RegisterForm from '../RegisterForm';

const LoadingComponent = lazy(() => import('../LoadingComponent'));

export default function DreamsForm() {
    const searchParams = useSearchParams();
    const dreamID = searchParams.get('dreamID');
    const openInterpretation = searchParams.get('openInterpretation') === 'true';

    const router = useRouter();
    const { user, session, setUserData } = useContext(UserContext);

    useEffect(() => {
        if (session?.user && !user) {
            setUserData();
        }
    }, [session])
    
    const [loading, setLoading] = useState(true);

    const [dream, setDream] = useState(null);
    const [interpretations, setInterpretations] = useState(null);
    const [oracles, setOracles] = useState(null);
    const [userDreamSymbols, setUserDreamSymbols] = useState([]);
    const [dreamComments, setDreamComments] = useState([]);
    const [dreamImage, setDreamImage] = useState();

    const [isDreamExpanded, setIsDreamExpanded] = useState(false);

    const [isPublic, setIsPublic] = useState(false);
    const [createAccount, setCreateAccount] = useState(false);

    // modals
    const [showEditDreamModal, setShowEditDreamModal] = useState(false);
    const [showDreamSettingsModal, setShowDreamSettingsModal] = useState(false);
    const [showDeleteDreamModal, setShowDeleteDreamModal] = useState(false);

    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const containerRef = useRef(null);

    const [isUsersOwnDream, setIsUsersOwnDream] = useState(false);

    const handleToggleDreamExpanded = () => {
        setIsDreamExpanded(!isDreamExpanded);
    }

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
                await axios.post('/api/user/updateSignUpType', { userID, signUpTypeID: SIGN_UP_TYPE_GOOGLE });
            }
        }

        if (user?._id) {
            handleGoogleSignUp();
        }
    }, [user])

    useEffect(() => {
        const checkPage = () => {
            if (!dreamID) {
                router.push('/');
            }
        }

        const getOracles = async () => {
            try {
                const resOracles = await axios.get("/api/allOracles");
                setOracles(resOracles.data);
            } catch (error) {
                console.log("There was an error fetching the dream oracles: ", error);
            }
        }

        checkPage();
        getOracles();
    }, [])

    useEffect(() => {
        const fetchDreamComments = async () => {
            try {
                const res = await axios.get(`/api/dream/comment/getComments/${dreamID}`);
                setDreamComments(res.data);
            } catch (error) {
                console.log("There was an error fetching the dream comments: ", error);
            }
        }

        const getDreamDetails = async () => {
            try {
                const dreamRes = await axios.get('/api/dream/' + dreamID);
                setDream(dreamRes.data.dream);
                setInterpretations(dreamRes.data.interpretations);
                setIsPublic(dreamRes.data.dream.isPublic);
                setDreamImage(dreamRes.data.dream.imageURL);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching dream details:", error);
            }
        };

        if (dreamID) {
            fetchUserDreamSymbols();
            fetchDreamComments();
            getDreamDetails();
        }
    }, [dreamID]);

    useEffect(() => {
        const generateDreamImage = async () => {
            try {
                const resSummarizeDream = await axios.get('https://us-central1-dream-oracles.cloudfunctions.net/dreamSummary',
                    {
                        params: {
                            dream: dream.dream
                        }
                    }
                );

                const dreamSummary = resSummarizeDream.data[0].message.content;

                const resDrawDream = await axios.post('https://us-central1-dream-oracles.cloudfunctions.net/generateDreamImage', 
                    { 
                        dreamID, 
                        dream: dreamSummary 
                    }
                );

                if (resDrawDream.data.imageURL) {
                    setDreamImage(resDrawDream.data.imageURL);
                }
            } catch (error) {
                console.error("There was an error drawing the dream: ", error);
            }
        }

        if (dream && !dreamImage) {
            generateDreamImage();
        }
    }, [dream, dreamImage])

    useEffect(() => {
        const generateUserDreamSymbols = async () => {
            try {
                const resDreamSymbols = await axios.get('https://us-central1-dream-oracles.cloudfunctions.net/dreamSymbols', 
                    { 
                        params: { 
                            dreamText: dream.dream, 
                            dreamID, 
                            userID: user._id 
                        } 
                    }
                );

                if (resDreamSymbols.data.success) {
                    fetchUserDreamSymbols();
                }
            } catch (error) {
                console.error("There was an error fetching the user dream symbols: ", error);
            }
        }

        if (dream && userDreamSymbols.length === 0 && user?._id) {
            generateUserDreamSymbols();
        }
    }, [dream, userDreamSymbols])

    useEffect(() => {
        const checkDreamUser = async () => {
            if (user && dream) {
                if (!dream?.userID && user?._id) {
                    // if dream has no userID, set the dream to have the current user's ID
                    const response = await axios.post('/api/dream/updateUserID', {
                        dreamID: dream._id,
                        userID: user?._id
                    });

                    setDream(prevDream => ({ ...prevDream, userID: user._id }));
                    setIsUsersOwnDream(true);
                } else if (user._id === dream.userID) {
                    setIsUsersOwnDream(true);
                } else {
                    setIsUsersOwnDream(false);
                }
            } else {
                setIsUsersOwnDream(false);
            }
        }

        checkDreamUser();
    }, [user, dream]);

    useEffect(() => {
        if (!user || user?._id !== dream?.userID) {
            setIsUsersOwnDream(false);
        }
        else {
            setIsUsersOwnDream(true);
        }
    }, [user, dream]);

    const fetchUserDreamSymbols = async () => {
        try {
            const res = await axios.get(`/api/dream/userDreamSymbols?dreamID=${dreamID}`);
            setUserDreamSymbols(res.data);
        } catch (error) {
            console.log("There was an error fetching the user dream symbols: ", error);
        }
    }

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

    const updateInterpretationFeedback = (interpretationID, liked) => {
        setInterpretations((prevInterpretations) =>
          prevInterpretations.map((interpretation) =>
            interpretation._id === interpretationID
              ? { ...interpretation, liked }
              : interpretation
          )
        );
      };

    const handleSaveDream = (updatedDreamText) => {
        setDream((prev) => ({...prev, dream: updatedDreamText}));
    }

    const handleInterpretDream = () => {
        console.log("interpreting the dream...");
    }

    const handleMouseDown = (e) => {
        if (containerRef.current) {
            setIsDragging(true);
            setStartX(e.pageX - containerRef.current.offsetLeft);
            setScrollLeft(containerRef.current.scrollLeft);
        }
    };

    const handleMouseMove = (e) => {
        if (!isDragging || !containerRef.current) return;
        e.preventDefault();
        const x = e.pageX - containerRef.current.offsetLeft;
        const walk = (x - startX) * 2; // Speed of scrolling
        containerRef.current.scrollLeft = scrollLeft - walk;
    };

    const handleMouseUpOrLeave = () => {
        setIsDragging(false);
    };
    
    const handleOpenEditDreamModal = () => {
        setShowDreamSettingsModal(false);
        setShowEditDreamModal(true);
    }

    const handleOpenDeleteDreamModal = () => {
        setShowDreamSettingsModal(false);
        setShowDeleteDreamModal(true);
    }

    const handleDeleteDream = async () => {
        const res = await axios.post('/api/dream/delete', { dreamID });
        if (res.status === 200) {
            router.push('/dreams');
        }
    }

    const handleToggleIsPublic = async () => {
        try {
            // Optimistically toggle the public/private state
            setIsPublic(!isPublic);

            // Send the POST request to update the dream's public/private status
            await axios.post('api/dream/public', {
                dreamID,
                isPublic: !isPublic
            });
        } catch (error) {
            // If the POST request fails, revert the state back to its original value
            console.error('Failed to update dream visibility:', error);
            setIsPublic(isPublic);  // Revert the state
        }
    };

    if (loading || !oracles || !dream) {
        return (
            <LoadingComponent loadingText={'Collecting Dream Details'} />
        );
    }

    return (
        <div className="main-content">
            {createAccount && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <RegisterForm viewInterpretation={true} />
                </div>
            )}
            <div className={`flex flex-col mb-10 text-white md:w-6/12 mx-auto p-2 ${createAccount && 'blur'}`}>
                <div className="md:flex md:flex-row">
                    <div className="interpretations-section md:w-1/3 relative">
                        {/* Three Dots Button */}
                        {isUsersOwnDream && (
                        <div className="absolute top-0 right-1 md:hidden">
                            <button className="text-white focus:outline-none bg-white bg-opacity-20 rounded-full h-10 w-10 flex items-center justify-center border border-white">
                                <FontAwesomeIcon icon={faEllipsisV} className="w-5 h-5" onClick={() => setShowDreamSettingsModal(true)} />
                            </button>
                        </div>
                        )}
                        {/* Interpretations Section */}
                        <p className="golden-ratio-1 md:text-xl mb-1 text-gold">Interpretations</p>
                        <div className="flex md:flex-col flex-row md:space-y-2">
                            {interpretations.map((interpretation) => {
                                const oracle = oracles.find((oracle) => oracle.oracleID === interpretation.oracleID);

                                return (
                                    <OracleInterpretations
                                        key={oracle.oracleID}
                                        interpretation={interpretation}
                                        oracle={oracle}
                                        openInterpretation={openInterpretation}
                                        updateInterpretationFeedback={updateInterpretationFeedback}
                                        dreamID={dreamID}
                                        setCreateAccount={setCreateAccount}
                                    />
                                );
                            })}
                        </div>
                    </div>
                    <div className="image-section relative md:w-2/3 md:ml-4">
                        {/* Three Dots Above the Image */}
                        {isUsersOwnDream && (
                            <div className="w-full justify-end mb-2 hidden md:flex">
                                <button className="text-white focus:outline-none bg-white bg-opacity-20 rounded-full h-10 w-10 flex items-center justify-center border border-white">
                                    <FontAwesomeIcon icon={faEllipsisV} className="w-5 h-5" onClick={() => setShowDreamSettingsModal(true)} />
                                </button>
                            </div>
                        )}
                        {/* Image Section */}
                        <div className="w-full md:w-full h-full md:h-auto">
                            {dreamImage ? (
                                <Image
                                    src={dreamImage}
                                    alt="the dream image"
                                    className="w-full h-full rounded-lg"
                                    width={500} // Adjust to your preferred fixed width
                                    height={500} // Adjust to your preferred fixed height
                                    unoptimized={true}
                                />
                            ) : (

                                <div className="w-full h-full flex items-center justify-center border-2 border-dashed rounded-lg pb-8">
                                    <LoadingComponent loadingText={"Generating Dream Image"} altScreen={true} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                {userDreamSymbols.length ? (
                    <div className="w-full mt-2">
                        <h3 className="text-xl font-bold text-white">Dream Symbols Found</h3>
                        <div
                            className="flex gap-4 mb-2 py-1 px-1 overflow-x-auto whitespace-nowrap hide-scrollbar cursor-grab"
                            ref={containerRef}
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUpOrLeave}
                            onMouseLeave={handleMouseUpOrLeave}
                            style={{ userSelect: "none" }}
                        >
                            {userDreamSymbols && userDreamSymbols.length > 0 ? (
                                userDreamSymbols.map((symbol, index) => (
                                    <SymbolCard key={index} symbol={symbol} className="inline-block" />
                                ))
                            ) : (
                                <div className="p-4 bg-gradient-to-r from-gray-700 to-gray-900 rounded-lg shadow-lg text-white text-center">
                                    No symbols found
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="border border-1 border-white rounded-xl p-4 my-4 pb-8">
                        <LoadingComponent loadingText={'Finding Dream Symbols'} altScreen={true} />
                    </div>
                )}
                <div>
                    <p className='golden-ratio-2 px-1'>{isDreamExpanded ? dream.dream : sliceDream(dream.dream)}</p>
                    {isUsersOwnDream && (
                        <p className="golden-ratio-2 text-right cursor-pointer" onClick={() => setShowEditDreamModal(true)}>
                            Edit Dream <FontAwesomeIcon icon={faPencil} className="cursor-pointer golden-ratio-2" />
                        </p>
                    )}
                </div>
                {dreamComments.length > 0 && (
                    <div>
                        <p className="golden-ratio-2">Comments</p>
                        {dreamComments.map((comment, index) => (
                            <div key={index} className="comment">
                                <p>{comment.dreamCommentContent}</p>
                            </div>
                        ))}
                    </div>
                )}


                {isUsersOwnDream && (
                    <div className="mt-5">
                        <label className="inline-flex items-center cursor-pointer">
                            {/* Hidden checkbox for accessibility */}
                            <input
                                type="checkbox"
                                checked={isPublic}
                                onChange={handleToggleIsPublic}
                                className="sr-only"
                            />
                            {/* Toggle Switch */}
                            <div
                                className={`relative w-14 h-8 rounded-full mr-2 transition-colors duration-300 ${
                                    isPublic ? 'bg-gold' : 'bg-gray-300'
                                }`}
                            >
                                <div
                                    className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                                        isPublic ? '' : 'translate-x-6'
                                    }`}
                                ></div>
                            </div>
                            <span className="mr-3 text-lg font-semibold flex items-center">
                                {isPublic ? (
                                    <>
                                        <GlobeAltIcon className="h-5 w-5 mr-1 text-gold" />
                                        Public
                                    </>
                                ) : (
                                    <>
                                        <LockClosedIcon className="h-5 w-5 mr-1 text-gray-500" />
                                        Private
                                    </>
                                )}
                            </span>
                        </label>
                    </div>
                )}
            </div>
            <DeleteDreamModal 
                isOpen={showDeleteDreamModal}
                onClose={() => setShowDeleteDreamModal(false)}
                onDelete={handleDeleteDream}
            />
            <DreamSettingsModal 
                isOpen={showDreamSettingsModal}
                onClose={() => setShowDreamSettingsModal(false)}
                onEditDream={handleOpenEditDreamModal}
                onDeleteDream={handleOpenDeleteDreamModal}
            />
            <EditDreamModal
                dream={dream}
                isOpen={showEditDreamModal}
                onClose={() => setShowEditDreamModal(false)}
                onSave={handleSaveDream}
            />
        </div>
    );
}