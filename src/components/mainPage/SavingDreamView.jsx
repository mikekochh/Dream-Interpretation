"use client";
import React, { lazy, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { PAGE_INTERPRET_LOADING } from '@/types/pageTypes';
import { UserContext } from '@/context/UserContext';

const LoadingComponent = lazy(() => import('../LoadingComponent'));
import QuestionsPreview from './QuestionsPreview';

export default function SavingDreamView({
    saveMessage,
    setContinueToQuestions,
    questionsReady
}) {  
    const [countedView, setCountedView] = useState(false);
    const { user } = useContext(UserContext) || {};

    useEffect(() => {
        const addView = async () => {
            const referrer = document.referrer;
            const isFromInstagram = referrer.includes('instagram.com');

            if (window.location.hostname !== 'localhost') {
                await axios.post('/api/views/addView', {
                    pageID: PAGE_INTERPRET_LOADING,
                    userID: user?._id,
                    isFromInstagram
                });
                setCountedView(true);
            }
        }

        if (!countedView) {
            addView();
        }
    }, []);

    return (
        <div className="flex justify-center items-center flex-col h-screen">
            <QuestionsPreview setContinueToQuestions={setContinueToQuestions} questionsReady={questionsReady} />
            {questionsReady ? (
                <button className="start-button" onClick={() => setContinueToQuestions(true)}>Start Answering</button>
            ) : (
                <LoadingComponent loadingText={saveMessage} altScreen={true} />
            )}
        </div>
    );     
}
