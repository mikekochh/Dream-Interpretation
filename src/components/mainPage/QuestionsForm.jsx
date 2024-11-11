"use client";
import React, { useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { PAGE_DREAM_DETAILS, PAGE_INTERPRET_LOADING } from '@/types/pageTypes';
import LoadingComponent from '../LoadingComponent';
import PublicDreamView from './PublicDreamView';
import { UserContext } from '@/context/UserContext';

export default function QuestionsForm({
    dreamQuestions,
    dreamID,
    oracleID
}) {  
    const isMobile = window.innerWidth <= 768;

    const { handleChangeSection } = useContext(UserContext) || {};

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState(Array(dreamQuestions.length).fill("")); 
    const [savingInterpretation, setSavingInterpretation] = useState(false);
    const [interpretationComplete, setInterpretationComplete] = useState(false);

    const router = useRouter();

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
        handleChangeSection(PAGE_INTERPRET_LOADING);
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

    const handleViewInterpretation = async () => {
        handleChangeSection(PAGE_DREAM_DETAILS);
        router.push('/dreamDetails?dreamID=' + dreamID + '&openInterpretation=true')
    }

    if (savingInterpretation) {
        return (
            <div className="flex flex-col justify-center items-center h-screen">
                <PublicDreamView dreamID={dreamID}/>
                {interpretationComplete ? (
                    <button className="start-button" onClick={handleViewInterpretation}>
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
