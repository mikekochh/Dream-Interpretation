"use client";
import React, { lazy } from 'react';

const WelcomeSection = lazy(() => import('./WelcomeSectionView'));
const MoodSection = lazy(() => import('./MoodSectionView'));
const OracleSelectionSection = lazy(() => import('./OracleSelectionSectionView'));

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
}) {
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
                    />
                </div>
            ) : (<div></div>)}
        </div>
    );
}
