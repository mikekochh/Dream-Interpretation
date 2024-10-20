"use client";
import React, { Suspense, useEffect, useState } from 'react';
import OracleSection from '../OracleSection';
import { PAGE_INTERPRET_ORACLE } from '@/types/pageTypes';
import axios from 'axios';

const OracleSelectionSection = ({
    user,
    scrollLeft,
    scrollContainerRef,
    oracles,
    handleSelectionChange,
    selectOracle,
    scrollRight,
    journalDream,
    buttonText,
    oracleSelected,
    createAccountFlow
}) => {

    const [countedView, setCountedView] = useState(false);

    useEffect(() => {
        const addView = async () => {
            if (window.location.hostname !== 'localhost') {
                await axios.post('/api/views/addView', {
                    pageID: PAGE_INTERPRET_ORACLE,
                    userID: user?._id
                });
                setCountedView(true);
            }
        }

        if (!countedView) {
            addView();
        }
    }, []);

    const isButtonDisabled = (!user?.activated && user?.name) || (!oracleSelected && !user?.name);

    return (
        <div id="interpretation-section" className="relative">
            <OracleSelectionPopup user={user} />
            <div className="flex items-center justify-center relative">
                <button onClick={scrollLeft} className="absolute left-0 z-10 p-2 bg-white bg-opacity-25 rounded-full shadow-md hover:bg-opacity-50 md:hidden">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                    </svg>
                </button>
                <div ref={scrollContainerRef} className="flex overflow-x-auto scroll-smooth scrollbar-hide md:overflow-x-visible md:flex-row">
                    {oracles.filter(oracle => oracle.active).map((oracle) => (
                        <div key={oracle._id} className="flex-none mx-2 md:flex-auto">
                            <Suspense fallback={<div/>}>
                                <OracleSection oracle={oracle} handleSelectionChange={handleSelectionChange} selectOracle={selectOracle} user={user} />
                            </Suspense>
                        </div>
                    ))}
                </div>
                <button onClick={scrollRight} className="absolute right-0 z-10 p-2 bg-white bg-opacity-25 rounded-full shadow-md hover:bg-opacity-50 md:hidden">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                </button>
            </div>
            <div className="flex flex-col items-center">
                <button
                    className={`start-button ${isButtonDisabled ? 'disabled-button' : ''}`}
                    onClick={user ? journalDream : createAccountFlow}
                    disabled={isButtonDisabled}
                >
                    {buttonText}
                </button>
                {!user?.activated && user?.name && (
                    <a className="text-gold golden-ratio-1 underline cursor-pointer" href={`/emailVerification?email=${user?.email}`}>Finish registering your account to continue</a>
                )}
            </div>
        </div>
    )
}

const OracleSelectionPopup = ({ user }) => {

    const isMobile = window.innerWidth < 768;

    return (
        <div className="justify-center golden-ratio-3 text-center px-1">
            <div className="flex flex-col justify-center items-center golden-ratio-2">
                <p className={`gradient-title-text ${isMobile ? 'golden-ratio-3' : 'golden-ratio-4'}`}>Choose an Oracle</p>
            </div>
            <div className="inline-flex items-center flex-col mb-3">
                <p className="golden-ratio-2">Select a Dream Oracle, with each oracle being one of our intelligent AI interpretation models</p>
                {!user && (
                    <p className="golden-ratio-1 text-gold mt-1">Complete your first interpretation to unlock all oracles</p>
                )}
            </div>
        </div>
    )
}

export default OracleSelectionSection;