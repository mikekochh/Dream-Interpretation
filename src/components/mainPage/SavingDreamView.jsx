"use client";
import React, { lazy, Suspense } from 'react';

const RegisterForm = lazy(() => import('../RegisterForm'));
const InterpretingDreamView = lazy(() => import('./InterpretingDreamView'));

export default function SavingDreamView({
    saveMessage,
    interpretingDream,
    user,
    resetPage,
    justJournal,
    goToDreamDetails,
    oracles,
    interpretationProgressArray,
    progressBarClass,
    oracleSelected,
    errorWhileJournaling
}) {
    return (
        <div className="overflow-container">
            <div className="flex justify-center items-center flex-col">
                <p className="text-center text-2xl golden-ratio-3">{saveMessage}</p>
                <div className="flex justify-center pb-5">
                    {interpretingDream ? (
                        <InterpretingDreamView
                            oracles={oracles}
                            interpretationProgressArray={interpretationProgressArray}
                            progressBarClass={progressBarClass}
                        />
                    ) : (
                        <div>
                            {!user ? (
                                <div>
                                    <div className="golden-ratio-2 text-center font-bold text-gold">
                                        <p>Create an account below to view your dream interpretation</p>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <button className="start-button" onClick={resetPage}>Journal New Dream</button>
                                    {!justJournal && !errorWhileJournaling && <button className="start-button" onClick={goToDreamDetails}>Go To Dream Details</button>}
                                </div>
                            )}
                        </div>
                    )}
                </div>
                {interpretingDream && !user?.name && (
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
        </div>
    );
}
