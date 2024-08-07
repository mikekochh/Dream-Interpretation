"use client";
import React, { useState, useEffect, useRef, lazy } from 'react';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { faPencil, faEye, faCirclePlus, faSave, faWindowClose, } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import OracleSection from './OracleSection';
const LoadingComponent = lazy(() => import('./LoadingComponent'));

export default function DreamsForm() {

    const { data: session } = useSession();

    const searchParams = useSearchParams();
    const dreamID = searchParams.get('dreamID');
    const router = useRouter();

    const [dreamDetails, setDreamDetails] = useState([]);
    const [user, setUser] = useState(null);
    
    const [saving, setSaving] = useState(false);
    const [updatingDream, setUpdatingDream] = useState(false);
    const [loadingInterpretations, setLoadingInterpretations] = useState(true); // Start as true
    const [interpretingDream, setInterpretingDream] = useState(false);
    const [loadingNotes, setLoadingNotes] = useState(true); // Start as true
    const [loadingUser, setLoadingUser] = useState(true); // New loading state for user data
    const [loading, setLoading] = useState(true); // New loading state
    const [askQuestionInterpretationID, setAskQuestionInterpretationID] = useState(null);
    const [dream, setDream] = useState(null);
    const [askingQuestion, setAskingQuestion] = useState(false);
    const [answer, setAnswer] = useState(null);
    const [edittingDream, setEdittingDream] = useState(false);
    const [interpretationProgressArray, setInterpretationProgressArray] = useState([0, 0, 0, 0, 0]);
    const [interpretationProgressIndex, setInterpretationProgressIndex] = useState(0);
    const [interpretationComplete, setInterpretationComplete] = useState(false);
    const [dreamEmotions, setDreamEmotions] = useState([]);
    const [emotions, setEmotions] = useState([]);
    const [loadingEmotions, setLoadingEmotions] = useState(true);
    const [notes, setNotes] = useState('');
    const [oracles, setOracles] = useState([]);
    const [interpretButtonActive, setInterpretButtonActive] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    const [toggleViewInterpretations, setToggleViewInterpretations] = useState(true);
    const [toggleAddInterpretations, setToggleAddInterpretations] = useState(false);
    const [toggleNotes, setToggleNotes] = useState(false);

    const [showFullInterpretation, setShowFullInterpretation] = useState({});

    const scrollContainerRef = useRef(null);
    const dreamRef = useRef(null);

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
        const getOracles = async () => {
            try {
                const oraclesRes = axios.get('/api/allOracles')
                setOracles(oraclesRes.data);
            } catch (error) {
                console.error("Error fetching oracles:", error);
            }
        };

        getOracles();
        setIsMobile(window.innerWidth < 768);
    }, []);

    useEffect(() => {
        const isAnyOracleSelected = oracles?.some(oracle => oracle.selected);
        setInterpretButtonActive(isAnyOracleSelected);
    }, [oracles]);

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
                setEmotions(resEmotions.data);
            } catch (error) {
                console.log("Error fetching emotions: ", error);
            } finally {
                setLoadingEmotions(false);
            }
         }

        checkPage();
        getUser();
        getEmotions();
    }, [])

    useEffect(() => {
        if (interpretingDream) {
            const interval = setInterval(() => {
                setInterpretationProgressArray(prevArray => {
                    const updatedArray = [...prevArray];
                    if (updatedArray[interpretationProgressIndex] <= 99) {
                        updatedArray[interpretationProgressIndex] += 0.10;
                        return updatedArray;
                    } else {
                        return updatedArray;
                    }
                });
            }, 25);
            return () => clearInterval(interval);
        }
    }, [interpretingDream, interpretationProgressArray.length, interpretationProgressIndex]);

    useEffect(() => {
        const fetchDreamEmotions = async () => {
            try {
                const res = await axios.get(`/api/emotions/getDreamEmotions?dreamID=${dreamID}`);
                setDreamEmotions(res.data);
            } catch (error) {
                console.log('Error fetching dream emotions:', error);
            }
        };

        if (dreamID) {
            fetchDreamEmotions();
        }
    }, [dreamID]);

    useEffect(() => {
        const isAnyOracleSelected = oracles?.some(oracle => oracle.selected);
        setInterpretButtonActive(isAnyOracleSelected);
    }, [oracles]);

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

    useEffect(() => {
        const getDreamDetails = async () => {
            setLoadingInterpretations(true);
            setLoadingNotes(true);
            try {
                const [dreamDetailsRes, oraclesRes, notesRes, dreamRes] = await Promise.all([
                    axios.get('api/dream/details/' + dreamID),
                    axios.get('/api/allOracles'),
                    axios.get('/api/dream/note/' + dreamID),
                    axios.get('/api/dream/' + dreamID),
                ]);

                setDreamDetails(dreamDetailsRes.data.dreamDetails);
                setOracles(oraclesRes.data);
                setLoadingInterpretations(false);

                if (!notesRes.data.dreamNotes.length) {
                    setLoadingNotes(false);
                } else {
                    setNotes(notesRes.data.dreamNotes[0].note);
                    setLoadingNotes(false);
                }
                setDream(dreamRes.data);
            } catch (error) {
                console.error("Error fetching dream details:", error);
                setLoadingInterpretations(false);
                setLoadingNotes(false);
            }
        };

        getDreamDetails();
    }, [dreamID, interpretationComplete]);

    useEffect(() => {
        if (!loadingUser && !loadingInterpretations && !loadingNotes) {
            setLoading(false); // Set loading to false only after all data is fetched
        }
    }, [loadingUser, loadingInterpretations, loadingNotes]);

    const selectOracle = (oracleID) => {
        setOracles(prev => {
            const updatedOracles = [...prev];
            const oracleIndex = updatedOracles.findIndex(oracle => oracle.oracleID === oracleID);
            updatedOracles[oracleIndex].selected = true;
            return updatedOracles;
        });
    }

    const interpretDream = async () => {
        try {
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
                    const dreamPrompt = `${oracles[i].prompt}${additionalContext}\nHere is the dream:\n###\n${dream}`;
                    const resInterpret = await axios.get('https://us-central1-dream-oracles.cloudfunctions.net/dreamLookup', {
                        params: { dreamPrompt }
                    });

                    if (resInterpret.status !== 200) {
                        console.log("There was an error interpreting the dream");
                        return;
                    }

                    const resUpdateDatabase = await axios.post('/api/dream/interpret', {
                        dreamID,
                        interpretation: resInterpret.data[0].message.content,
                        oracleID: oracles[i].oracleID,
                        user
                    });

                    if (resUpdateDatabase.status !== 200) {
                        console.log("There was an error saving the interpretations...");
                        return;
                    }

                    setInterpretationProgressArray(prevArray => {
                        const updatedArray = [...prevArray];
                        updatedArray[i] = 100;
                        return updatedArray;
                    });

                    setInterpretationProgressIndex(i + 1);
                }
            }
            setInterpretingDream(false);
            setInterpretationComplete(true);
            setToggleViewInterpretations(true);
            setToggleAddInterpretations(false);
        } catch (err) {
            console.log("There was an error interpreting the dreams: ", err);
        }
    }

    const formatInterpretationDate = (dreamDate) => {
        const date = new Date(dreamDate);
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const year = date.getFullYear();
        return `${month}/${day}/${year}`;
    }

    const getOracleName = (oracleID) => {
        if (!oracles.length) return;
        const oracle = oracles.find(oracle => oracle.oracleID === oracleID);
        return oracle.oracleName;
    }

    const insertLineBreaks = (text) => {
        const lines = text.split('\n').filter(line => line.trim() !== '');
        const formattedText = [];
        let previousWasHeading = false;
    
        lines.forEach((line, index) => {
            const headingMatch = line.match(/^### (.*)$/);
            const boldTitleMatch = line.match(/^\*\*(.*)\*\*$/);
    
            if (headingMatch || boldTitleMatch) {
                if (index !== 0 && !previousWasHeading) {
                    // Add an extra line break before a new section
                    formattedText.push(<br key={`extra-${index}`} />);
                }
                // Add the heading or bold title
                formattedText.push(
                    <p className="golden-ratio-2 font-bold" key={`heading-${index}`}>
                        {headingMatch ? headingMatch[1] : boldTitleMatch[1]}
                    </p>
                );
                previousWasHeading = true;
            } else {
                formattedText.push(
                    <React.Fragment key={index}>
                        {line}
                    </React.Fragment>
                );
                // Add a line break after each line except the last one
                if (index < lines.length - 1) {
                    formattedText.push(<br key={`br-${index}`} />);
                }
                previousWasHeading = false;
            }
        });
    
        return formattedText;
    };

    const toggleFullInterpretation = (id) => {
        setShowFullInterpretation(prevState => ({
            ...prevState,
            [id]: !prevState[id]
        }));
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

    const saveNotes = async () => {
        console.log("SaveNotes running...");
        try {
            setSaving(true);
            await axios.post('api/dream/note/' + dreamID, { note: notes });
            setToggleNotes(false);
            setSaving(false);
        } catch (err) {
            console.log("There was an error saving the note: ", err);
        }
    }

    const handleNotesChange = (e) => {
        setNotes(e.target.value);
    };

    const backToDreams = () => {
        router.push('/dreams');
    }

    const endDreamUpdate = async () => {
        if (dreamRef.current) {
            const newDream = dreamRef.current.innerText;
            setDream(newDream);
            setEdittingDream(false);
            try {
                await axios.post('api/dream/update', {
                    newDream: newDream,
                    dreamID
                });
            } catch (err) {
                console.log("There was an error updating the dream: ", err);
            }
        }
    };

    const askQuestion = async (interpretationID, oracleID) => {
        setAskingQuestion(true);
        const question = document.querySelector('.question-box').value;
        const dreamDetailElements = document.querySelectorAll('.detail-box');
        let interpretationText = '';

        dreamDetailElements.forEach((element) => {
            if (element.getAttribute('data-id') === interpretationID) {
                const interpretationP = element.querySelector('.interpretation-box');
                if (interpretationP) {
                    interpretationText = interpretationP.textContent;
                }
            }
        });

        const res = await axios.post('/api/dream/question/', {
            question,
            interpretation: interpretationText,
            dream,
            oracleID
        });

        if (res.status === 200) {
            setAskingQuestion(false);
            setAnswer(res.data.answerText);
        }
    }

    const editDream = () => {
        setEdittingDream(true);
    }

    const getEmotionName = (emotionID) => {
        const emotion = emotions.find(e => e.emotionID === emotionID);
        return emotion ? emotion.emotionName : 'Unknown Emotion';
    };

    function handleSelectionChange(selected, oracleID) {
        setOracles(prev => {
            const updatedOracles = [...prev];
            const oracleIndex = updatedOracles.findIndex(oracle => oracle.oracleID === oracleID);
            updatedOracles[oracleIndex].selected = !selected;
            return updatedOracles;
        });
    }

    if (loading) {
        return (
            <LoadingComponent loadingText={'Collecting Dream Details'} />
        );
    }

    return (
        <div className="flex flex-col main-content h-screen text-white">
            <div className="ml-1">
                <button className="start-button golden-ratio-1" onClick={backToDreams}>Back To Journal</button>
            </div>
            <div className="flex justify-center border rounded-xl m-2 border-gold-small">
                <div className='p-2 mb-2 w-11/12'>
                    <h1 className="text-center golden-ratio-3 text-gold">The Dream</h1>
                    <div>
                        <div
                            ref={dreamRef}
                            contentEditable={edittingDream}
                            suppressContentEditableWarning={true}
                            className={`cursor-pointer golden-ratio-2 text-gold ${edittingDream ? 'border-2 border-black rounded-lg p-2' : ''}`}
                            onClick={!edittingDream ? editDream : undefined}
                        >
                            {dream}
                        </div>
                        <div className={`flex flex-wrap gap-2 justify-center p-4 ${edittingDream ? 'pointer-events-none' : ''}`}>
                            {dreamEmotions.map((emotion) => (
                                <div 
                                    key={emotion._id} 
                                    className="px-4 py-2 bg-gray-200 rounded-lg text-black"
                                >
                                    {getEmotionName(emotion.emotionID)}
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-end items-center">
                            {edittingDream ? (
                                <>
                                    {updatingDream ? (
                                        <LoadingComponent />
                                    ) : (
                                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-2 dream-button" onClick={endDreamUpdate}>Done</button>
                                    )}
                                </>
                            ) : (
                                <p className="golden-ratio-2 text-right cursor-pointer" onClick={editDream}>
                                    Edit Dream <FontAwesomeIcon icon={faPencil} className="cursor-pointer golden-ratio-2" />
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex md:flex-row flex-col relative pb-12">
                <div className="md:w-2/3 text-white">
                    {dreamDetails.length > 0 && oracles ? (
                        <div>
                            <ViewInterpretationSection
                                toggleViewInterpretations={toggleViewInterpretations}
                                setToggleViewInterpretations={setToggleViewInterpretations}
                                toggleAddInterpretations={toggleAddInterpretations}
                                setToggleAddInterpretations={setToggleAddInterpretations}
                                dreamDetails={dreamDetails}
                                getOracleName={getOracleName}
                                showFullInterpretation={showFullInterpretation}
                                formatInterpretationDate={formatInterpretationDate}
                                insertLineBreaks={insertLineBreaks}
                                toggleFullInterpretation={toggleFullInterpretation}
                                askQuestionInterpretationID={askQuestionInterpretationID}
                                askingQuestion={askingQuestion}
                                answer={answer}
                                askQuestion={askQuestion}
                                setAskQuestionInterpretationID={setAskQuestionInterpretationID}
                                user={user}
                                isMobile={isMobile}
                                scrollLeft={scrollLeft}
                                scrollRight={scrollRight}
                                scrollContainerRef={scrollContainerRef}
                                oracles={oracles}
                                handleSelectionChange={handleSelectionChange}
                                interpretButtonActive={interpretButtonActive}
                                interpretDream={interpretDream}
                                interpretingDream={interpretingDream}
                                interpretationProgressArray={interpretationProgressArray}
                                interpretationProgressIndex={interpretationProgressIndex}
                                selectOracle={selectOracle}
                            />
                        </div>
                    ) : (
                        <div className="mx-2">
                            <AddInterpretationSection 
                                toggleAddInterpretations={toggleAddInterpretations}
                                setToggleAddInterpretations={setToggleAddInterpretations}
                                user={user}
                                isMobile={isMobile}
                                scrollLeft={scrollLeft}
                                scrollRight={scrollRight}
                                scrollContainerRef={scrollContainerRef}
                                oracles={oracles}
                                handleSelectionChange={handleSelectionChange}
                                interpretButtonActive={interpretButtonActive}
                                interpretDream={interpretDream}
                                interpretingDream={interpretingDream}
                                interpretationProgressArray={interpretationProgressArray}
                                interpretationProgressIndex={interpretationProgressIndex}
                                selectOracle={selectOracle}
                            />
                        </div>
                    )}
                </div>
                <div className="md:w-1/3 mx-2">
                    <div className="text-white">
                        {loadingNotes && (
                            <div className="flex text-center justify-center inset-0 items-center pt-20 pb-5">
                                <p className="text-center text-3xl pr-3">Loading Notes</p>
                                <LoadingComponent />
                            </div>
                        )}
                        {toggleNotes && !loadingNotes && (
                            <div className="mt-2">
                                {!saving && (
                                    <div className="mb-2">
                                        <button 
                                            className="dream-details-button w-full border border-white rounded-xl text-center golden-ratio-2"
                                            onClick={() => setToggleNotes(false)}
                                        >
                                            Close Notes <FontAwesomeIcon icon={faWindowClose} className="pl-1"/>
                                        </button>
                                    </div>
                                )}
                                {saving ? (
                                    <LoadingComponent loadingText={"Saving Notes"} altScreen={true} />
                                ) : (
                                    <textarea
                                        type="text"
                                        rows={10}
                                        className="DreamBox NoteBox border-2 border-black rounded-lg text-black w-full h-full p-2"
                                        style={{ minHeight: '100px' }}
                                        placeholder='Notes on dream or interpretations go here'
                                        value={notes}
                                        onChange={(e) => handleNotesChange(e)}
                                    />
                                )}
                                <div className="">
                                    {!saving && (
                                        <div className="cursor-pointer">
                                            <button 
                                                className="dream-details-button w-full border border-white rounded-xl text-center golden-ratio-2"
                                                onClick={saveNotes}
                                            >
                                                Save Notes <FontAwesomeIcon icon={faSave} className="pl-1"/>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                        {!toggleNotes && !loadingNotes && (
                            <div className="cursor-pointer mt-2">
                                <button 
                                    className="dream-details-button w-full border border-white rounded-xl text-center golden-ratio-2"
                                    onClick={() => setToggleNotes(true)}
                                >
                                    {notes ? 'Edit Notes' : 'Add Notes'}
                                    <FontAwesomeIcon 
                                        icon={notes ? faPencil : faCirclePlus} className="pl-2"
                                    />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

const AddInterpretationSection = ({
    toggleAddInterpretations,
    setToggleAddInterpretations,
    user,
    isMobile,
    scrollLeft,
    scrollRight,
    scrollContainerRef,
    oracles,
    handleSelectionChange, 
    interpretButtonActive,
    interpretDream,
    interpretingDream,
    interpretationProgressArray,
    interpretationProgressIndex,
    selectOracle
}) => {

    return (
        <div className="">
            {toggleAddInterpretations ? (
                <div>
                    {!interpretingDream ? (
                        <div>
                            <div className="h-full relative">
                                <p className={`gradient-title-text text-center ${isMobile ? 'golden-ratio-3' : 'golden-ratio-4'}`}>Choose an Oracle</p>
                                <div className="flex items-center justify-center relative">
                                    <button onClick={scrollLeft} className="absolute left-0 z-10 p-2 bg-white bg-opacity-25 rounded-full shadow-md hover:bg-opacity-50 md:hidden">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                                        </svg>
                                    </button>
                                    <div ref={scrollContainerRef} className="flex overflow-x-auto scroll-smooth scrollbar-hide md:overflow-x-visible md:flex-row">
                                        {oracles.filter(oracle => oracle.active).map((oracle) => (
                                            <div key={oracle._id} className="flex-none mx-2 md:flex-auto">
                                                <OracleSection oracle={oracle} handleSelectionChange={handleSelectionChange} selectOracle={selectOracle} user={user} />
                                            </div>
                                        ))}
                                    </div>
                                    <button onClick={scrollRight} className="absolute right-0 z-10 p-2 bg-white bg-opacity-25 rounded-full shadow-md hover:bg-opacity-50 md:hidden">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                        </svg>
                                    </button>
                                </div>
                                <div className="flex flex-col items-center text-center">
                                    <div className="flex items-center mt-2">
                                        <button
                                        className={`py-2 px-4 rounded justify-center m-2 start-button items-center ${
                                            interpretButtonActive && user?.activated ? '' : 'opacity-50 cursor-not-allowed'
                                        }`}
                                            onClick={interpretDream}
                                            disabled={!interpretButtonActive || !user?.activated}
                                        >
                                            Interpret
                                        </button>
                                        <button 
                                            className="py-2 px-4 rounded m-2 start-button items-center"
                                            onClick={() => setToggleAddInterpretations(false)}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                    {!user?.activated && (
                                        <a className="text-gold golden-ratio-1 underline cursor-pointer mt-2" href={`/emailVerification?email=${user?.email}`}>
                                        Finish registering your account to continue
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div className='loadingContainer mb-5'>
                                <p className="text-center golden-ratio-2">Interpreting Your Dream</p>
                                <p className='loadingText'>Please wait while we interpret your dream</p>
                                <div className='dotsContainer'>
                                    <div className='dot delay200'></div>
                                    <div className='dot delay400'></div>
                                    <div className='dot'></div>
                                </div>
                            </div>
                            <div>
                                {oracles.map((oracle, index) => {
                                    if (oracle.selected) {
                                        return (
                                            <div key={oracle._id}>
                                                <div className="text-center">{oracle.oracleName}</div>
                                                <div className="flex justify-center">
                                                    <div data-label="Interpreting..." className="progress-bar w-2/3"> {/* Adjust the width class as needed */}
                                                        <div className="progress-bar-inside" style={{ width: `${interpretationProgressArray[index]}%` }}>Interpreting...</div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }
                                })}
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div>
                    <div className="cursor-pointer mt-2">
                        <button 
                            className="dream-details-button w-full border border-white rounded-xl text-center golden-ratio-2"
                            onClick={() => setToggleAddInterpretations(true)}
                        >
                            Add Interpretations 
                            <FontAwesomeIcon 
                                icon={faCirclePlus} className="pl-2"
                            />
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

const ViewInterpretationSection = ({
    toggleViewInterpretations,
    setToggleViewInterpretations,
    toggleAddInterpretations,
    setToggleAddInterpretations,
    dreamDetails,
    getOracleName,
    showFullInterpretation,
    formatInterpretationDate,
    insertLineBreaks,
    toggleFullInterpretation,
    askQuestionInterpretationID,
    askingQuestion,
    answer,
    askQuestion,
    setAskQuestionInterpretationID,
    user,
    isMobile,
    scrollLeft,
    scrollRight,
    scrollContainerRef,
    oracles,
    handleSelectionChange,
    interpretButtonActive,
    interpretDream,
    interpretingDream,
    interpretationProgressArray,
    interpretationProgressIndex,
    selectOracle
}) => {
    return (
        <div className="mt-2 mx-2">
            {toggleViewInterpretations ? (
                <div>
                    <div className="cursor-pointer mb-2">
                        <button 
                            className="dream-details-button w-full border border-white rounded-xl text-center golden-ratio-2"
                            onClick={() => setToggleViewInterpretations(false)}
                        >
                            Close Interpretations <FontAwesomeIcon icon={faWindowClose} className="pl-1"/>
                        </button>
                    </div>
                {dreamDetails.map((detail) => (
                    <div
                        key={detail._id}
                        data-id={detail._id}
                        className="flex flex-col items-center justify-center text-white border-white border rounded-xl detail-box"
                    >
                        <div className="pl-2">
                            <p className="golden-ratio-2 text-center font-bold">Interpretation by {getOracleName(detail.oracleID)} on {formatInterpretationDate(detail.interpretationDate)}</p>
                            <p className="interpretation-box">
                                {!showFullInterpretation[detail._id] && (
                                    <div>
                                        <span className="font-bold golden-ratio-2">Summary</span><br/>
                                    </div>
                                )}
                                
                                {showFullInterpretation[detail._id] ? insertLineBreaks(detail.interpretation) : detail.interpretation.split('\n\n').pop()}
                            </p>
                            <button onClick={() => toggleFullInterpretation(detail._id)} className="font-bold">
                                {showFullInterpretation[detail._id] ? "Show Less" : "Read More"}
                            </button>
                        </div>
                        {askQuestionInterpretationID === detail._id ? (
                            <div className="w-full">
                                <div className="flex flex-col w-full p-4">
                                    <textarea
                                        className="DreamBox border-2 border-black rounded-lg text-black w-full question-box"
                                        placeholder="Type your question here"
                                    />
                                    {askingQuestion && !answer ? (
                                        <div className="flex text-center justify-center items-center pb-5">
                                            <p className="text-center text-3xl pr-3">Asking Question</p>
                                            <LoadingComponent />
                                        </div>
                                    ) : (
                                        <div className="text-center">
                                            <button className="dream-button" onClick={() => askQuestion(detail._id, detail.oracleID)}>Submit</button>
                                            <div className="back-button-container">
                                                <button className="back-button" onClick={() => setAskQuestionInterpretationID(null)}>Cancel</button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {answer && (
                                    <div className="flex flex-col w-full p-4">
                                        <p className="font-bold text-center">Answer</p>
                                        <p className="text-center DreamBox rounded-xl p-2">{insertLineBreaks(answer)}</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <button className="dream-button hidden" onClick={() => setAskQuestionInterpretationID(detail._id)}>Ask Question</button>
                        )}
                    </div>
                ))}
                    <div className="mt-4">
                        <AddInterpretationSection 
                            toggleAddInterpretations={toggleAddInterpretations}
                            setToggleAddInterpretations={setToggleAddInterpretations}
                            user={user}
                            isMobile={isMobile}
                            scrollLeft={scrollLeft}
                            scrollRight={scrollRight}
                            scrollContainerRef={scrollContainerRef}
                            oracles={oracles}
                            handleSelectionChange={handleSelectionChange}
                            interpretButtonActive={interpretButtonActive}
                            interpretDream={interpretDream}
                            interpretingDream={interpretingDream}
                            interpretationProgressArray={interpretationProgressArray}
                            interpretationProgressIndex={interpretationProgressIndex}
                            selectOracle={selectOracle}
                        />
                    </div>
                </div>

            ) : (
                <div>
                    <div className="cursor-pointer">
                        <button 
                            className="dream-details-button w-full border border-white rounded-xl text-center golden-ratio-2"
                            onClick={() => setToggleViewInterpretations(true)}
                        >
                            View Interpretations 
                            <FontAwesomeIcon 
                                icon={faEye} className="pl-2"
                            />
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}