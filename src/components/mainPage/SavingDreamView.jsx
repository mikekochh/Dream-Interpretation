"use client";
import React, { lazy, Suspense } from 'react';

const RegisterForm = lazy(() => import('../RegisterForm'));
const LoadingComponent = lazy(() => import('../LoadingComponent'));

export default function SavingDreamView({
    saveMessage,
    user
}) {
    return (
        <div className="flex justify-center items-center flex-col">
            <LoadingComponent loadingText={saveMessage} />
            {!user?.name && (
                <div className="flex justify-center">
                    <div className="golden-ratio-2 text-center font-bold text-gold md:w-2/3 mx-5">
                        Create an account below to view your interpretation once it&apos;s ready
                    </div>
                </div>
            )}
            {!user && (
                <div className="text-center flex justify-center">
                    <Suspense fallback={<div>Loading...</div>}>
                        <RegisterForm />
                    </Suspense>
                </div>
            )}
        </div>
    );
}
