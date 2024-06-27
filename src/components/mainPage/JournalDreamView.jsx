"use client";
import React, { lazy } from 'react';

const WelcomeSection = lazy(() => import('./WelcomeSectionView'));
const ShareDreamSection = lazy(() => import('./ShareDreamSectionView'));
const MoodSection = lazy(() => import('./MoodSectionView'));
const OracleSelectionSection = lazy(() => import('./OracleSelectionSectionView'));

export default function JournalDreamView({
    user,
    error,
    dream,
    setDream,
    handleSelectionChange,
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
    setDreamStep,
    incrementDreamStep,
    decrementDreamStep,
    oracleSelected
}) {
    return (
        <div className="flex justify-center items-center min-h-screen relative">
            {dreamStep === 0 ? (
                <div className={`overflow-y-auto h-screen ${user ? 'main-content-home' : 'main-content'}`}>
                    <WelcomeSection
                        user={user}
                        dreamStreak={dreamStreak}
                        setDreamStep={setDreamStep}
                        incrementDreamStep={incrementDreamStep}
                    />
                </div>
            ) : dreamStep === 1 ? (
                <div>
                    <div className="back-button-container">
                        <button className="back-button golden-ratio-1" onClick={decrementDreamStep}>Back</button>
                    </div>
                    <ShareDreamSection
                        error={error}
                        dream={dream}
                        setDream={setDream}
                        incrementDreamStep={incrementDreamStep}
                        decrementDreamStep={decrementDreamStep}
                    />
                </div>
            ) : dreamStep === 2 ? (
                <div>
                    <div className="back-button-container">
                        <button className="back-button golden-ratio-1" onClick={decrementDreamStep}>Back</button>
                    </div>
                    <MoodSection
                        emotions={emotions}
                        handleEmotionClick={handleEmotionClick}
                        selectedEmotions={selectedEmotions}
                        incrementDreamStep={incrementDreamStep}
                        decrementDreamStep={decrementDreamStep}
                    />
                </div>
            ) : dreamStep === 3 ? (
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
                        scrollRight={scrollRight}
                        journalDream={journalDream}
                        buttonText={buttonText}
                        decrementDreamStep={decrementDreamStep}
                        oracleSelected={oracleSelected}
                    />
                </div>
            ) : (<div></div>)}
        </div>
    );
}
