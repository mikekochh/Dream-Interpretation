"use client";
import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

// Directly import all components without lazy loading
import WelcomeSection from './WelcomeSectionView';
import MoodSection from './MoodSectionView';
import OracleSelectionSection from './OracleSelectionSectionView';
import RegisterForm from '../RegisterForm';

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
    const containerRef = useRef(null);
    const [isAnimating, setIsAnimating] = useState(false); // Track if an animation is in progress
    const [currentStep, setCurrentStep] = useState(dreamStep); // Local state for dreamStep

    useEffect(() => {
        if (!isAnimating && currentStep !== dreamStep) {
            setIsAnimating(true);

            // Animate fade-out
            gsap.to(containerRef.current, {
                opacity: 0,
                y: -20,
                duration: 0.6,
                ease: 'power2.in',
                onComplete: () => {
                    // Once fade-out is complete, update the step
                    setCurrentStep(dreamStep);

                    // Animate fade-in
                    gsap.fromTo(
                        containerRef.current,
                        { opacity: 0, y: 20 },
                        {
                            opacity: 1,
                            y: 0,
                            duration: 0.6,
                            ease: 'power2.out',
                            onComplete: () => {
                                setIsAnimating(false); // Animation is done, reset the flag
                            }
                        }
                    );
                }
            });
        }
    }, [dreamStep, currentStep, isAnimating]);

    return (
        <div ref={containerRef} className="flex justify-center items-center min-h-screen relative">
            {currentStep === 0 ? (
                <div className={`overflow-y-auto hide-scrollbar h-screen ${user ? 'main-content' : 'main-content'}`}>
                    <WelcomeSection
                        user={user}
                        dreamStreak={dreamStreak}
                        incrementDreamStep={incrementDreamStep}
                        setDream={setDream}
                        dream={dream}
                    />
                </div>
            ) : currentStep === 1 ? (
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
            ) : currentStep === 2 ? (
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
