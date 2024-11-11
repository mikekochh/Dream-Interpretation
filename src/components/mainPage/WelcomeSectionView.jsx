"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import DreamStream from '../DreamStreamPreview';
import WhatsInsideView from './WhatsInsideView';
import { PAGE_LANDING_PAGE } from '@/types/pageTypes';
import axios from 'axios';

const WelcomeSection = ({ 
    incrementDreamStep, 
    setDream, 
    dream,
    handleScrollToTop
}) => {
    const [isMobile, setIsMobile] = useState(false);
    const [countedView, setCountedView] = useState(false);

    useEffect(() => {
        const addPageView = async () => {
            const referrer = document.referrer;
            const isFromInstagram = referrer.includes('instagram.com');

            if (window.location.hostname !== 'localhost') {
                await axios.post('/api/views/addView', {
                    pageID: PAGE_LANDING_PAGE,
                    isFromInstagram
                });
                setCountedView(true);
            }
        }

        if (!countedView) {
            addPageView();
        }
    }, [countedView])

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
            <p className="text-white golden-ratio-1 mb-4">
                No credit card required.
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

    {/* New "Signing up is free!" section */}
    <div className="mt-8 text-center">
        <p className="text-white text-xl font-bold">Signing up is free!</p>
        <div className="flex justify-center mt-4 space-x-4">
            <div className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <p className="text-white">Unlimited Interpretations</p>
            </div>
            <div className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <p className="text-white">Access to Community</p>
            </div>
            <div className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <p className="text-white">Access to all AI Models</p>
            </div>
        </div>
    </div>
</div>


            {/* join the dream oracles community to take the path of exploring the meaning behind your dreams */}
            <WhatsInsideView handleScrollToTop={handleScrollToTop} />
            <div className="my-4 mx-4" style={{ borderTop: '0.5px solid rgba(229, 231, 235, 0.5)' }}></div>
            <DreamStream />
            <div className="my-4 mx-4" style={{ borderTop: '0.5px solid rgba(229, 231, 235, 0.5)' }}></div>
            
            {/* How It Works Section */}
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
                        <p className="golden-ratio-1">Answer questions generated from your dream and discover detailed interpretations on your dream</p>
                    </div>
                </div>
            </div>
            <div className="text-center">
                <button className="start-button" onClick={handleScrollToTop}>
                    Try It Now!
                </button>
            </div>
            {/* Mandela Image */}
            <div className="image-container text-center mt-4">
                <Image src="/mandela.webp" alt="Mandela" width={500} height={500} className="mandela-image" />
            </div>
        </div>
    );
};

export default WelcomeSection;
