"use client";
import React, { lazy } from 'react';

const LoadingComponent = lazy(() => import('../LoadingComponent'));
import PublicDreamView from './PublicDreamView';

export default function SavingDreamView({
    saveMessage,
    user
}) {    
    return (
        <div className="flex justify-center items-center flex-col h-screen">
            <PublicDreamView />
            <LoadingComponent loadingText={saveMessage} altScreen={true} />
        </div>
    );   
}
