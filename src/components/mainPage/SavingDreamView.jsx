"use client";
import React, { lazy, useContext } from 'react';
import { PAGE_QUESTIONS } from '@/types/pageTypes';
import { UserContext } from '@/context/UserContext';

const LoadingComponent = lazy(() => import('../LoadingComponent'));
import QuestionsPreview from './QuestionsPreview';

export default function SavingDreamView({
    saveMessage,
    setContinueToQuestions,
    questionsReady
}) {  
    const { handleChangeSection } = useContext(UserContext) || {};

    const handleStartAnswering = () => {
        setContinueToQuestions(true);
        handleChangeSection(PAGE_QUESTIONS);
    }

    return (
        <div className="flex justify-center items-center flex-col h-screen">
            <QuestionsPreview setContinueToQuestions={setContinueToQuestions} questionsReady={questionsReady} />
            {questionsReady ? (
                <button className="start-button" onClick={() => handleStartAnswering()}>Start Answering</button>
            ) : (
                <LoadingComponent loadingText={saveMessage} altScreen={true} />
            )}
        </div>
    );     
}
