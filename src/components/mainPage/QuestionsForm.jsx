"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { PAGE_QUESTIONS } from '@/types/pageTypes';
import LoadingComponent from '../LoadingComponent';
import PublicDreamView from './PublicDreamView';

export default function QuestionsForm({
    dreamQuestions,
    dreamID,
    oracleID
}) {  
    const isMobile = window.innerWidth <= 768;

    const [countedView, setCountedView] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [error, setError] = useState("");
    const [savingInterpretation, setSavingInterpretation] = useState(false);

    // make sure the questions are thought provoking, getting the dreamer to reflect upon their dream and almost help them interpret the dream themselves

    const router = useRouter();

    useEffect(() => {
        const addView = async () => {
            const referrer = document.referrer;
            const isFromInstagram = referrer.includes('instagram.com');

            if (window.location.hostname !== 'localhost') {
                await axios.post('/api/views/addView', {
                    pageID: PAGE_QUESTIONS,
                    userID: user?._id,
                    isFromInstagram
                });
                setCountedView(true);
            }
        };

        if (!countedView) {
            addView();
        }
    }, []);

    const handleAnswerChange = (event) => {
        setAnswers(prev => ({
            ...prev,
            [currentQuestionIndex]: event.target.value
        }));
    };

    const handlePreviousQuestion = () => {
        setError("");
        setCurrentQuestionIndex(currentQuestionIndex - 1);
    }

    const handleNextQuestion = () => {
        if (answers[currentQuestionIndex] === undefined || answers[currentQuestionIndex] === "") {
            setError("Please answer this question");
        }
        else {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setError("");
        }
    };

    const handleInterpretDream = async () => {
        if (answers[currentQuestionIndex] === undefined || answers[currentQuestionIndex] === "") {
            setError("Please answer this question");
        }
        setSavingInterpretation(true);
        const response = await axios.get('https://us-central1-dream-oracles.cloudfunctions.net/dreamLookupWithQuestions', { 
            params: { 
                dreamID,
                oracleID: oracleID,
                questions: dreamQuestions,
                answers: answers
            } 
        });
        router.push('/dreamDetails?dreamID=' + dreamID + '&openInterpretation=true');
    };

    if (savingInterpretation) {
        return (
            <div className="flex flex-col justify-center items-center h-screen">
                <PublicDreamView dreamID={dreamID}/>
                <LoadingComponent loadingText={"Finishing Interpretation"} altScreen={true} />
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
                {error && (<p className="text-red-500 golden-ratio-1">* {error}</p>)}
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
                            className={`${isMobile ? 'start-button-small' : 'start-button'}`}
                        >
                            Next Question
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
