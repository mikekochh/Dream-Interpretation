"use client";
import React, { lazy, useState, useEffect } from 'react';
import axios from 'axios';
import { PAGE_INTERPRET_LOADING } from '@/types/pageTypes';

const LoadingComponent = lazy(() => import('../LoadingComponent'));
import PublicDreamView from './PublicDreamView';

export default function SavingDreamView({
    saveMessage,
    dreamID,
    user
}) {  
    const [countedView, setCountedView] = useState(false);

    useEffect(() => {
        const addView = async () => {
            const response = await axios.post('/api/views/addView', {
                pageID: PAGE_INTERPRET_LOADING,
                userID: user?._id
            });
            setCountedView(true);
        }

        if (!countedView) {
            addView();
        }
    }, []);

    return (
        <div className="flex justify-center items-center flex-col h-screen">
            <PublicDreamView dreamID={dreamID} />
            <LoadingComponent loadingText={saveMessage} altScreen={true} />
        </div>
    );   
}
