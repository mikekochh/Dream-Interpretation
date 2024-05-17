"use client";
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import OracleSection from './OracleSection';
import { isIn } from 'validator';

export default function DreamsForm() { 

    const searchParams = useSearchParams();
 
    const dreamID = searchParams.get('dreamID');

    const [dreamDetails, setDreamDetails] = useState([]);
    const [user, setUser] = useState(null);
    const [oracles, setOracles] = useState([]);
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [updatingDream, setUpdatingDream] = useState(false);
    const [loadingInterpretations, setLoadingInterpretations] = useState(false);
    const [loadingNotes, setLoadingNotes] = useState(false);
    const [askQuestionInterpretationID, setAskQuestionInterpretationID] = useState(null);
    const [dream, setDream] = useState(null);
    const [askingQuestion, setAskingQuestion] = useState(false);
    const [answer, setAnswer] = useState(null);
    const [edittingDream, setEdittingDream] = useState(false);
    const [interpretingDream, setInterpretingDream] = useState(false);
    const [interpretButtonActive, setInterpretButtonActive] = useState(false);
    const [interpretationProgressArray, setInterpretationProgressArray] = useState([0, 0, 0, 0, 0]);
    const [interpretationProgressIndex, setInterpretationProgressIndex] = useState(0);
    const [interpretationComplete, setInterpretationComplete] = useState(false);

    useEffect(() => {
        const checkPage = () => {
            if (!dreamID) {
                router.push('/interpret');
            }
        }

        const getUser = async () => {
            const userDetails = await axios.get("/api/dream/getUser/" + dreamID);
            setUser(userDetails.data.user);
        }

        checkPage();
        getUser();
    }, [])

    useEffect(() => {
        if (interpretingDream) {
            const interval = setInterval(() => {
                setInterpretationProgressArray(prevArray => {
                    const updatedArray = [...prevArray];
                    if (updatedArray[interpretationProgressIndex] <= 99) {
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
        const isAnyOracleSelected = oracles.some(oracle => oracle.selected);
        if (isAnyOracleSelected) {
            setInterpretButtonActive(true);
        } else {
            setInterpretButtonActive(false);
        }
    }, [oracles]);

    useEffect(() => {
        const getDreamDetails = async () => {
            setLoadingInterpretations(true);
            setLoadingNotes(true);
            const res = await axios.get('api/dream/details/' + dreamID);
            setDreamDetails(res.data.dreamDetails);
            const resOracles = await axios.get('/api/allOracles');
            setOracles(resOracles.data);
            setLoadingInterpretations(false);
            const resNotes = await axios.get('/api/dream/note/' + dreamID);
            if (!resNotes.data.dreamNotes.length) {
                // textAreaRef.current.classList.remove('hidden');
                setLoadingNotes(false);
            } 
            else {
                document.querySelector('.NoteBox').value = resNotes.data.dreamNotes[0].note;
                setLoadingNotes(false);
            }
            const resDream = await axios.get('/api/dream/' + dreamID);
            setDream(resDream.data);
        }

        getDreamDetails();
    }, [dreamID, interpretationComplete]);

    const formatInterpretationDate = (dreamDate) => {
        const date = new Date(dreamDate);
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const year = date.getFullYear();
        return month + "/" + day + "/" + year;
    }

    const getOracleName = (oracleID) => { 
        if (!oracles.length) return;
        const oracle = oracles.find(oracle => oracle.oracleID === oracleID);
        return oracle.oracleName;
    }

    const insertLineBreaks = (text) => {
        const lines = text.split('\n');
        return lines.map((line, index) => (
          <React.Fragment key={index}>
            {line}
            {index < lines.length - 1 && <br />}
          </React.Fragment>
        ));
    }

    const saveNotes = async () => {
        try {
            setSaving(true);
            const note = document.querySelector('.NoteBox').value;
            const res = await axios.post('api/dream/note/' + dreamID, { note });
            router.push('/dreams');
        } catch (err) {
            console.log("There was an error saving the note: ", err);
        }
    }

    const interpretDream = async () => {
        try {
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

                    console.log("Are we getting a response from here?");
                    console.log("resInterpret: ", resInterpret);

                    if (resInterpret.status !== 200) {
                        console.log("There was an error interpreting the dream");
                        return;
                    }

                    const resUpdateDatabase = await axios.post('/api/dream/interpret', 
                    {
                        dreamID,
                        interpretation: resInterpret.data[0].message.content,
                        oracleID: oracles[i].oracleID,
                        user
                    });

                    console.log("resUpdateDatabase: ", resUpdateDatabase);

                    if (resUpdateDatabase.status !== 200) {
                        console.log("There was an error saving the interpretations...");
                        return;
                    }

                    setInterpretationProgressArray(prevArray => {
                        const updatedArray = [...prevArray];
                        updatedArray[i] = 100;
                        return updatedArray;
                    });
    
                    setInterpretationProgressIndex(i+1);
                }
            }
            setInterpretingDream(false);
            setInterpretationComplete(true);
            location.reload();
        } catch (err) {
            console.log("There was an error interpreting the dreams: ", err);
        }
    }

    const backToDreams = () => {
        router.push('/dreams');
    }

    const endDreamUpdate = async () => {
        try {
            setEdittingDream(false);
            const res = await axios.post('api/dream/update', {
                newDream: dream,
                dreamID
            })
        } catch (err) {
            console.log("There was an error updating the dream: ", err);
        }
    }

    const askQuestion = async (interpretationID, oracleID) => {
        setAskingQuestion(true);
        const question = document.querySelector('.question-box').value;

        const dreamDetailElements = document.querySelectorAll('.detail-box');

        let interpretationText = '';
        dreamDetailElements.forEach((element) => {
            if(element.getAttribute('data-id') === interpretationID) {
                const interpretationP = element.querySelector('.interpretation-box');
                if(interpretationP) {
                    interpretationText = interpretationP.textContent;
                }
            }
        });

        const res = await axios.post('/api/dream/question/', 
        { 
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
        console.log("editting dream");
        setEdittingDream(true);
    }

    function handleSelectionChange(selected, oracleID) {
        // setCreditCost(prevCost => selected ? prevCost - 1 : prevCost + 1);
        setOracles(prev => {
            const updatedOracles = [...prev];
            const oracleIndex = updatedOracles.findIndex(oracle => oracle.oracleID === oracleID);
            updatedOracles[oracleIndex].selected = !selected;
            return updatedOracles;
        });
    }

    return (
        <div className="flex flex-col main-content h-screen text-white">
            <div className="flex justify-center border rounded-xl m-2 border-gold-small">
                <div className='p-2 mb-2 w-11/12'>
                    <h1 className="text-center golden-ratio-3 text-gold">The Dream</h1>
                    {!edittingDream ? (
                        <div>
                            <p className="golden-ratio-2 text-gold">{dream}</p>
                            <p className="golden-ratio-2 text-right cursor-pointer" onClick={editDream}>Edit Dream <FontAwesomeIcon icon={faPencil} className="cursor-pointer golden-ratio-2"/></p>
                        </div>
                    ) : (
                        <div>
                            <textarea 
                                type="text" 
                                rows={5}
                                className="DreamBox NoteBox border-2 border-black rounded-lg text-black w-full h-full p-2"
                                style={{ minHeight: '100px' }}
                                placeholder='Notes on dream or interpretations go here'
                                value={dream}
                                onChange={(e) => setDream(e.target.value)}
                            />
                            <div className="flex justify-end items-end md:relative">
                                {updatingDream ? (
                                    <div className="flex right-0 absolute m-2 top-0">
                                        <div className="loader"></div>
                                    </div>
                                ) : (
                                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded right-0 justify-end m-2 bottom-0 dream-button" onClick={endDreamUpdate}>Done</button>
                                )}
                            </div>
                        </div>

                    )}
                </div>
            </div>
            <div className="flex md:flex-row flex-col relative pb-12">

                <div className="md:w-2/3 text-white">
                    {loadingInterpretations && (
                        <div className="flex text-center justify-center inset-0 items-center pt-20 pb-5">
                            <p className="text-center text-3xl pr-3">Loading Interpretations</p>
                            <div className="loader"></div>  
                        </div>
                    )}
                    {dreamDetails.length > 0 && oracles ? (

                        dreamDetails.map((detail) => (
                            <div 
                                key={detail._id} 
                                data-id={detail._id}
                                className="flex flex-col items-center justify-center text-white border-white border m-2 rounded-xl pr-2 detail-box"
                            >
                                <div className=" pl-2">
                                    <p className="golden-ratio-2 text-center font-bold">Interpretation by {getOracleName(detail.oracleID)} on {formatInterpretationDate(detail.interpretationDate)}</p>
                                    <p className="interpretation-box">
                                        <span className="font-bold"></span>{insertLineBreaks(detail.interpretation)}
                                    </p>
                                </div>
                                
                                {askQuestionInterpretationID === detail._id ? (
                                    <div className="w-full">
                                        <div className="flex flex-col w-full p-4">
                                            <textarea 
                                                className="DreamBox border-2 border-black rounded-lg text-black w-full p-2 question-box" 
                                                placeholder="Type your question here"
                                            />
                                            {askingQuestion && !answer ? (
                                            <div className="flex text-center justify-center items-center pb-5">
                                                <p className="text-center text-3xl pr-3">Asking Question</p>
                                                <div className="loader"></div>  
                                            </div>
                                            ) : (
                                                <div className="text-center">
                                                    <button className="dream-button" onClick={() => askQuestion(detail._id, detail.oracleID)}>Submit</button>
                                                    <button className="back-button" onClick={() => setAskQuestionInterpretationID(null)}>Cancel</button>
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
                        )
                    )) : !interpretingDream ? (
                        <div className="h-full">
                            <p className="golden-ratio-2 text-center font-bold">Add interpretations</p>
                            <div className="flex flex-row justify-center items-center">
                                <div className="flex flex-nowrap">
                                    {oracles.filter(oracle => oracle.active).map((oracle) => (
                                        <div key={oracle._id} className="flex-auto mx-2">
                                            <OracleSection oracle={oracle} handleSelectionChange={handleSelectionChange} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="flex flex-col items-center text-center">
                                <button
                                    className={`bg-blue-500 text-white font-bold py-2 px-4 rounded justify-center m-2 bottom-0 dream-button items-center ${
                                        interpretButtonActive && user?.activated ? 'hover:bg-blue-700' : 'opacity-50 cursor-not-allowed'
                                    }`}
                                    onClick={interpretDream}
                                    disabled={!interpretButtonActive || !user?.activated}
                                >
                                    Interpret
                                </button>
                                {!user?.activated && (
                                    <a className="text-gold golden-ratio-1 underline cursor-pointer" href={`/emailVerification?email=${user?.email}`}>Finish registering your account to continue</a>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div className='loadingContainer'>
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
                    )}
                </div>
                <div className="md:w-1/3">
                    <div className="p-2 text-white">
                        {loadingNotes && (
                            <div className="flex text-center justify-center inset-0 items-center pt-20 pb-5">
                                <p className="text-center text-3xl pr-3">Loading Notes</p>
                                <div className="loader"></div>  
                            </div>
                        )}
                        <textarea 
                            type="text" 
                            rows={20}
                            className="DreamBox NoteBox border-2 border-black rounded-lg text-black w-full h-full p-2"
                            style={{ minHeight: '100px' }}
                            placeholder='Notes on dream or interpretations go here'
                        />
                    </div>
                    <div className="flex justify-end items-end md:relative">
                        <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded m-2 back-button" onClick={backToDreams}>Back</button>
                        {saving ? (
                            <div className="flex right-0 absolute m-2 top-0">
                                <div className="loader"></div>
                            </div>
                        ) : (
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded right-0 justify-end m-2 bottom-0 dream-button" onClick={saveNotes}>Save</button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}