"use client";
import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { PAGE_QUESTIONS } from '@/types/pageTypes';
import LoadingComponent from '../LoadingComponent';
import PublicDreamView from './PublicDreamView';
import { UserContext } from '@/context/UserContext';

export default function QuestionsForm({
    dreamQuestions,
    dreamID,
    oracleID
}) {  
    const isMobile = window.innerWidth <= 768;

    const { user } = useContext(UserContext) || {};

    const [countedView, setCountedView] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState(Array(dreamQuestions.length).fill("")); 
    const [savingInterpretation, setSavingInterpretation] = useState(false);
    const [interpretationComplete, setInterpretationComplete] = useState(false);
    const [startTime, setStartTime] = useState(Date.now());

    const router = useRouter();

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                handleEndView();
            }
        }

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('beforeunload', handleEndView);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('beforeunload', handleEndView);
        };
    }, [startTime]);

    const handleEndView = async () => {
        console.log("handleEndView running...");
        const endTime = Date.now();
        const sessionLength = Math.floor((endTime - startTime) / 1000);
        const referrer = document.referrer;
        const isFromInstagram = referrer.includes('instagram.com');

        // window.location.hostname !== 'localhost'

        if (true) {
            await axios.post('/api/views/addView', {
                pageID: PAGE_QUESTIONS,
                userID: user?._id,
                isFromInstagram,
                sessionLength
            });
            setCountedView(true);
        }

        try {

        } catch (error) {
            console.error('Error tracking view on page leave: ', error);
        }
    }

    // useEffect(() => {
    //     const addView = async () => {
    //         const referrer = document.referrer;
    //         const isFromInstagram = referrer.includes('instagram.com');

    //         if (window.location.hostname !== 'localhost') {
    //             await axios.post('/api/views/addView', {
    //                 pageID: PAGE_QUESTIONS,
    //                 userID: user?._id,
    //                 isFromInstagram
    //             });
    //             setCountedView(true);
    //         }
    //     };

    //     if (!countedView) {
    //         addView();
    //     }
    // }, []);

    const handleAnswerChange = (event) => {
        setAnswers(prev => {
            const updatedAnswers = [...prev];
            updatedAnswers[currentQuestionIndex] = event.target.value;
            return updatedAnswers;
        });
    };

    const handlePreviousQuestion = () => {
        setCurrentQuestionIndex(currentQuestionIndex - 1);
    }

    const handleNextQuestion = () => {
        setAnswers(prev => {
            const updatedAnswers = [...prev];
            // If the current answer is empty, set it to an empty string to indicate a skipped question
            if (!updatedAnswers[currentQuestionIndex]) {
                updatedAnswers[currentQuestionIndex] = "";
            }
            return updatedAnswers;
        });
        setCurrentQuestionIndex(currentQuestionIndex + 1);
    };

    const handleInterpretDream = async () => {
        setSavingInterpretation(true);
        handleEndView();
        const response = await axios.get('https://us-central1-dream-oracles.cloudfunctions.net/dreamLookupWithQuestions', { 
            params: { 
                dreamID,
                oracleID: oracleID,
                questions: dreamQuestions,
                answers: answers
            } 
        });
        setInterpretationComplete(true);
    };

    if (savingInterpretation) {
        return (
            <div className="flex flex-col justify-center items-center h-screen">
                <PublicDreamView dreamID={dreamID}/>
                {interpretationComplete ? (
                    <button className="start-button" onClick={() => router.push('/dreamDetails?dreamID=' + dreamID + '&openInterpretation=true')}>
                        View Interpretation
                    </button>
                ) : (
                    <LoadingComponent loadingText={"Finishing Interpretation"} altScreen={true} />
                )}
            </div>
        )
    }

    return (
        <div className="flex justify-center items-center flex-col h-screen">
            <h1 className="gradient-title-text golden-ratio-4 text-center mb-4">Dream Questions</h1>
            <div className="flex flex-col items-center w-full text-center">
                <h2 className="mb-4 golden-ratio-2 md:w-2/3 mx-2">{dreamQuestions[currentQuestionIndex]}</h2>
                <textarea
                    value={answers[currentQuestionIndex] || ""}
                    onChange={handleAnswerChange}
                    className="DreamBox golden-ratio-2 border-2 p-3 border-black rounded-lg text-black md:m-0 w-full md:w-2/3 h-48"
                    placeholder="Write your answer here"
                />
                <p>Question {currentQuestionIndex + 1} / {dreamQuestions.length}</p>
                <div className="mt-5">
                    {currentQuestionIndex > 0 && (
                        <button
                            onClick={handlePreviousQuestion}
                            className={`${isMobile ? 'secondary-button-mobile' : 'secondary-button'}`}
                        >
                            Previous Question
                        </button>
                    )}
                    {currentQuestionIndex < dreamQuestions.length - 1 ? (
                        <button
                            onClick={handleNextQuestion}
                            className={`${
                                (answers[currentQuestionIndex]?.length || 0) === 0
                                    ? isMobile ? 'secondary-button-mobile' : 'secondary-button'
                                    : isMobile ? 'start-button-small' : 'start-button'
                            }`}
                        >
                            {(answers[currentQuestionIndex]?.length || 0) === 0 ? 'Skip Question' : 'Next Question'}
                        </button>
                    ) : (
                        <button
                            onClick={handleInterpretDream}
                            className={`${isMobile ? 'start-button-small' : 'start-button'}`}
                        >
                            Interpret Dream
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
    
}
