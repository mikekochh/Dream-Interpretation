"use client";
import React, { lazy, Suspense } from 'react';
const OracleSection = lazy(() => import('../OracleSection'));

const OracleSelectionSection = ({
    user,
    scrollLeft,
    scrollContainerRef,
    oracles,
    handleSelectionChange,
    scrollRight,
    journalDream,
    buttonText,
    oracleSelected
}) => {

    const isButtonDisabled = (!user?.activated && user?.name) || (!oracleSelected && !user?.name);

    return (
        <div id="interpretation-section" className="relative">
            <OracleSelectionPopup credits={user?.credits} />
            <div className="flex items-center justify-center relative">
                <button onClick={scrollLeft} className="absolute left-0 z-10 p-2 bg-white bg-opacity-25 rounded-full shadow-md hover:bg-opacity-50 md:hidden">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                    </svg>
                </button>
                <div ref={scrollContainerRef} className="flex overflow-x-auto scroll-smooth scrollbar-hide md:overflow-x-visible md:flex-row">
                    {oracles.filter(oracle => oracle.active).map((oracle) => (
                        <div key={oracle._id} className="flex-none mx-2 md:flex-auto">
                            <Suspense fallback={<div>Loading...</div>}>
                                <OracleSection oracle={oracle} handleSelectionChange={handleSelectionChange} />
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
                    onClick={journalDream}
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

const OracleSelectionPopup = ({ credits }) => {

    const isMobile = window.innerWidth < 768;

    return (
        <div className="justify-center golden-ratio-3 text-center px-1">
            <div className="flex flex-col justify-center items-center golden-ratio-2">
                <p className={`gradient-title-text ${isMobile ? 'golden-ratio-4' : 'golden-ratio-5'}`}>Choose an Oracle</p>
            </div>
            <div className="inline-flex items-center">
                <p className="golden-ratio-2 mb-3">Select a Dream Oracle, with each oracle being one of our intelligent AI interpretation models</p>
            </div>
        </div>
    )
}

export default OracleSelectionSection;