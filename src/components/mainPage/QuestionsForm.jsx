"use client";
import React, { lazy, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { PAGE_QUESTIONS } from '@/types/pageTypes';
import SavingDreamView from './SavingDreamView';

export default function QuestionsForm({
    dreamQuestions,
    dreamID,
    oracleID
}) {  
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
        router.push('/dreamDetails?dreamID=' + dreamID);
        setSavingInterpretation(false);
    };

    if (savingInterpretation) {
        return (
            <SavingDreamView saveMessage={"Finishing Interpretation"} dreamID={dreamID} />
        )
    }

    return (
        <div className="flex justify-center items-center flex-col h-screen">
            <h1 className="gradient-title-text golden-ratio-5">Dream Questions</h1>
            <h2 className="golden-ratio-2 mb-5">Please answer these questions to uncover more details and context for your interpretation</h2>
            <div className="flex flex-col items-center w-full text-center">
                <h2 className="mb-4 golden-ratio-2 w-2/3">{dreamQuestions[currentQuestionIndex]}</h2>
                <textarea
                    value={answers[currentQuestionIndex] || ""}
                    onChange={handleAnswerChange}
                    className="DreamBox golden-ratio-2 border-2 p-3 border-black rounded-lg text-black md:m-0 w-2/3 h-48"
                    placeholder="Write your answer here"
                />
                <p>Question {currentQuestionIndex + 1} / {dreamQuestions.length}</p>
                {error && (<p className="text-red-500 golden-ratio-1">* {error}</p>)}
                <div className="mt-5">
                    {currentQuestionIndex > 0 && (
                        <button
                            onClick={handlePreviousQuestion}
                            className="secondary-button"
                        >
                            Previous Question
                        </button>
                    )}
                    {currentQuestionIndex < dreamQuestions.length - 1 ? (
                        <button
                            onClick={handleNextQuestion}
                            className="start-button"
                        >
                            Next Question
                        </button>
                    ) : (
                        <button
                            onClick={handleInterpretDream}
                            className="start-button"
                        >
                            Interpret Dream
                        </button>
                    )}

                </div>
            </div>
        </div>
    );   
}
