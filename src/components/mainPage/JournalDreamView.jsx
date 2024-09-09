"use client";
import React, { lazy } from 'react';

const WelcomeSection = lazy(() => import('./WelcomeSectionView'));
const MoodSection = lazy(() => import('./MoodSectionView'));
const OracleSelectionSection = lazy(() => import('./OracleSelectionSectionView'));
const RegisterForm = lazy(() => import('../RegisterForm'));

export default function JournalDreamView({
    user,
    dream,
    setDream,
    handleSelectionChange,
    selectOracle,
    oracles,
    journalDream,
    buttonText,
    scrollLeft,
    scrollRight,
    scrollContainerRef,
    emotions,
    handleEmotionClick,
    selectedEmotions,
    dreamStreak,
    dreamStep,
    incrementDreamStep,
    decrementDreamStep,
    oracleSelected,
    createAccountFlow
}) {

    const isMobile = window.innerWidth < 768;

    return (
        <div className="flex justify-center items-center min-h-screen relative">
            {dreamStep === 0 ? (
                <div className={`overflow-y-auto h-screen ${user ? 'main-content' : 'main-content'}`}>
                    <WelcomeSection
                        user={user}
                        dreamStreak={dreamStreak}
                        incrementDreamStep={incrementDreamStep}
                        setDream={setDream}
                        dream={dream}
                    />
                </div>
            ) : dreamStep === 1 ? (
                <div>
                    <div className="back-button-container">
                        <button className="back-button golden-ratio-1" onClick={decrementDreamStep}>Back</button>
                    </div>
                    <MoodSection
                        emotions={emotions}
                        handleEmotionClick={handleEmotionClick}
                        selectedEmotions={selectedEmotions}
                        incrementDreamStep={incrementDreamStep}
                    />
                </div>
            ) : dreamStep === 2 ? (
                <div>
                    <div className="back-button-container">
                        <button className="back-button golden-ratio-1" onClick={decrementDreamStep}>Back</button>
                    </div>
                    <OracleSelectionSection
                        user={user}
                        scrollLeft={scrollLeft}
                        scrollContainerRef={scrollContainerRef}
                        oracles={oracles}
                        handleSelectionChange={handleSelectionChange}
                        selectOracle={selectOracle}
                        scrollRight={scrollRight}
                        journalDream={journalDream}
                        buttonText={buttonText}
                        oracleSelected={oracleSelected}
                        createAccountFlow={createAccountFlow}
                    />
                </div>
            ) : (
                <div className="text-center">
                    <p className={`gradient-title-text ${isMobile ? 'golden-ratio-3' : 'golden-ratio-4'}`}>Create an Account</p>
                    <p className="golden-ratio-2">Create an account with us to view your dream interpretation</p>
                    <div className="text-center flex justify-center">
                        <RegisterForm />
                    </div>
                </div>
            )}
        </div>
    );
}
