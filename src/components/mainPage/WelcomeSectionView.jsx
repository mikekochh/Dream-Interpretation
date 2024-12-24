"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import DreamStream from '../DreamStreamPreview';
import WhatsInsideView from './WhatsInsideView';
import LibraryHomeScreen from '../LibraryHomeScreen';

const WelcomeSection = ({ 
    incrementDreamStep, 
    setDream, 
    dream,
    handleScrollToTop
}) => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        // Set the initial state based on window size
        handleResize();

        // Listen to window resize
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div>
            <div className="md:w-2/3 md:px-0 px-2 mx-auto">
                <div>
                    <p className="text-center golden-ratio-4 gradient-title-text">Understand Your Dreams</p>
                    <p className="text-center golden-ratio-2">
                        Use our dream interpretation AI software to turn your dreams into insights that foster self-awareness, guide 
                        personal growth, and lead to mental clarity.
                    </p>
                </div>

                <div className="mt-4">
                    <div className="border border-white rounded-xl p-4 bg-white bg-opacity-10 shadow-2xl">
                        <p className="text-white golden-ratio-2 font-semibold">
                            Start by entering your dream below
                        </p>
                        <textarea
                            type="text"
                            rows={7}
                            placeholder="Enter your dream here"
                            className="DreamBox golden-ratio-2 p-1 rounded-lg text-black md:m-0 w-full"
                            value={dream}
                            onChange={(event) => setDream(event.target.value)}
                        />
                        <div className="text-center">
                            <button 
                                className={`start-button golden-ratio-1 ${dream.length < 20 && 'disabled-button'}`}
                                onClick={incrementDreamStep}
                                disabled={dream.length < 20}
                            >
                                {dream.length === 0 ? 'Enter Dream Above' : dream.length < 20 ? 'Keep Going!' : 'Interpret Your Dream'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <h1 className='golden-ratio-4 gradient-title-text mt-10 text-center'>How Does It Work?</h1>
                <div className="image-container flex flex-col md:flex-row">
                    {/* Steps */}
                    <div className={`${isMobile ? 'border-bottom step-section-mobile' : 'border-right step-section'}`}>
                        <Image src="/ShareDreamStep.svg" alt="Step 1" width={50} height={50} className={`${isMobile ? 'step-image-mobile' : 'step-image'}`} />
                        <p className="golden-ratio-1">Step 1:</p>
                        <p className="golden-ratio-2">Share your dream</p>
                        <p className="golden-ratio-1">Write down everything that you remember and try to include as many details as possible</p>
                    </div>
                    <div className={`${isMobile ? 'border-bottom step-section-mobile' : 'border-right step-section'}`}>
                        <Image src="/OracleStep.svg" alt="Step 2" width={50} height={50} className={`${isMobile ? 'step-image-mobile' : 'step-image'}`} />
                        <p className="golden-ratio-1">Step 2:</p>
                        <p className="golden-ratio-2">Choose an Oracle</p>
                        <p className="golden-ratio-1">Select a dream oracle, with each oracle being one of our intelligent AI interpretation models</p>
                    </div>
                    <div className={`${isMobile ? 'step-section-mobile' : 'step-section'}`}>
                        <Image src="/LearnStep.svg" alt="Step 3" width={50} height={50} className={`${isMobile ? 'step-image-mobile' : 'step-image'}`} />
                        <p className="golden-ratio-1">Step 3:</p>
                        <p className="golden-ratio-2 reduce-line-spacing">Learn about your dream</p>
                        <p className="golden-ratio-1">Discover detailed interpretations of your dream, uncovering its hidden meanings and insights</p>
                    </div>
                </div>
            </div>
            <div className="text-center">
                <button className="start-button" onClick={handleScrollToTop}>
                    Try It Now!
                </button>
            </div>
            {/* Library section */}
            {/* Also add here a search bar where they can search for symbols from their dream */}

            <LibraryHomeScreen />
            <div className="my-4 mx-4" style={{ borderTop: '0.5px solid rgba(229, 231, 235, 0.5)' }}></div>
            <DreamStream />
            <div className="my-4 mx-4" style={{ borderTop: '0.5px solid rgba(229, 231, 235, 0.5)' }}></div>
        
            {/* Mandela Image */}
            <div className="image-container text-center mt-4">
                <Image src="/mandela.webp" alt="Mandela" width={500} height={500} className="mandela-image" />
            </div>
        </div>
    );
};

export default WelcomeSection;
