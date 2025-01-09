"use client";
import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

import StartPageView from './StartPageView';
import OracleSelectionSection from './OracleSelectionSectionView';
import PublicDreamView from './PublicDreamView';

export default function JournalDreamView({
    user,
    dream,
    setDream,
    handleSelectionChange,
    oracles,
    journalDream,
    buttonText,
    dreamStreak,
    dreamStep,
    incrementDreamStep,
    decrementDreamStep,
    selectedOracle,
    setPublicDream,
    publicDream
}) {
    const containerRef = useRef(null);
    const welcomeSectionRef = useRef(null);
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


    const handleScrollToTop = () => {
        if (welcomeSectionRef.current) {
            welcomeSectionRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <div ref={containerRef} className="flex justify-center items-center min-h-screen relative">
            {currentStep === 0 ? (
                <div ref={welcomeSectionRef} className={`overflow-y-auto hide-scrollbar h-screen main-content`}>
                    <StartPageView
                        dreamStreak={dreamStreak}
                        incrementDreamStep={incrementDreamStep}
                        setDream={setDream}
                        dream={dream}
                        handleScrollToTop={handleScrollToTop}
                    />
                </div>
            ) : currentStep === 1 ? (
                <div>
                    <div className="back-button-container">
                        <button className="back-button golden-ratio-1" onClick={decrementDreamStep}>Back</button>
                    </div>
                    <PublicDreamView incrementDreamStep={incrementDreamStep} publicDream={publicDream} setPublicDream={setPublicDream} />
                </div>
            ) : (
                <div>
                    <div className="back-button-container">
                        <button className="back-button golden-ratio-1" onClick={decrementDreamStep}>Back</button>
                    </div>
                    <OracleSelectionSection
                        user={user}
                        oracles={oracles}
                        handleSelectionChange={handleSelectionChange}
                        journalDream={journalDream}
                        buttonText={buttonText}
                        selectedOracle={selectedOracle}
                    />
                </div>
            )}
        </div>
    );
}
