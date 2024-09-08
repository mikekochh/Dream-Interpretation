"use client";
import React, { lazy, Suspense } from 'react';

const RegisterForm = lazy(() => import('../RegisterForm'));
const LoadingComponent = lazy(() => import('../LoadingComponent'));

export default function SavingDreamView({
    saveMessage,
    user,
    interpretationComplete
}) {    
    return (
        <div className="flex justify-center items-center flex-col">
            {!interpretationComplete ? (
                <LoadingComponent loadingText={saveMessage} altScreen={!user}/>
            ) : (
                <div className='main-content'>
                    <p className="text-center loadingText">Dream interpretation complete! Please create an account to continue</p>
                </div>
            )}
            {!user && (
                <div className="mt-8">
                    {!interpretationComplete ? (
                        <p className="golden-ratio-2 text-center font-bold text-gold md:2/3 mx-5">Create an account below to view your interpretation once it&apos;s ready</p>
                    ) : (
                        <p className="golden-ratio-2 text-center font-bold text-gold md:2/3 mx-5">Create an account below to view your interpretation</p>
                    )}
                    <div className="text-center flex justify-center">
                        <RegisterForm />
                    </div>
                </div>
            )}
        </div>
    );
}
