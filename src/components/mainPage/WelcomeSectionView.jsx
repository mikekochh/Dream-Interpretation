"use client";
import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import PurchaseButton from '../PurchaseButton';
import { gsap } from 'gsap';

const WelcomeSection = ({ 
    user, 
    dreamStreak, 
    incrementDreamStep, 
    setDream, 
    dream 
}) => {
    const isMobile = window.innerWidth < 768;

    const titleRef = useRef(null);
    const subtitleRef = useRef(null);
    const descriptionRef = useRef(null);
    const restOfPageRef = useRef(null);

    // Animate on mount using GSAP
    useEffect(() => {
        const timeline = gsap.timeline();

        // 1. Animate the welcome text (if it exists)
        timeline.fromTo(
            titleRef.current, 
            { opacity: 0, y: 50 }, 
            { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
        );

        // 2. Animate "Dream Oracles" text
        timeline.fromTo(
            subtitleRef.current, 
            { opacity: 0, y: 50 }, 
            { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
            "-=0.5" // Overlap with the previous animation by 0.5 seconds
        );

        // 3. Animate the mini description below
        timeline.fromTo(
            descriptionRef.current, 
            { opacity: 0, y: 50 }, 
            { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
            "-=0.5" // Overlap with the previous animation by 0.5 seconds
        );

        // 4. Animate the rest of the page content (textarea and buttons)
        timeline.fromTo(
            restOfPageRef.current, 
            { opacity: 0, y: 50 }, 
            { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
            "-=0.5"
        );
    }, []);

    return (
        <div>
            <div className="md:w-2/3 md:px-0 px-2 mx-auto">
                {/* 1. Welcome Text */}
                <p ref={titleRef} className="text-center golden-ratio-2">Welcome to</p>

                {/* 2. Dream Oracles Text */}
                <p ref={subtitleRef} className="text-center golden-ratio-5 gradient-title-text">Dream Oracles</p>

                {/* 3. Description */}
                <p ref={descriptionRef} className="text-center golden-ratio-2 mb-4">
                    {user ? 'What was your dream ' + user?.name + "?" : 'Interpret your dreams using our intelligent dream interpretation AI models'}
                </p>

                {/* 4. Rest of the page */}
                <div ref={restOfPageRef} className="">
                    <textarea
                        type="text"
                        rows={7}
                        placeholder='Dream goes here'
                        className="DreamBox golden-ratio-2 border-2 p-1 border-black rounded-lg text-black  md:m-0 m-2 w-full"
                        value={dream}
                        onChange={(event) => setDream(event.target.value)}
                    />
                    {!user || (user?.activated && user?.subscribed) ? (
                        <div className="text-center">
                            <div className="button-container">
                                <button 
                                    className={`start-button golden-ratio-1 ${dream.length < 20 && 'disabled-button'}`}
                                    onClick={incrementDreamStep}
                                    disabled={dream.length < 20}
                                >
                                    {dream.length === 0 ? 'Enter Dream Above' : dream.length < 20 ? 'Keep Going!' : 'Interpret Your Dream'}
                                </button>
                            </div>
                            {!user && (<Link href="/login" className="text-gold golden-ratio-1 underline text-center">Already Have Account?</Link>)}
                        </div>
                    ) : (
                        <div className='text-center'>
                            <p className="golden-ratio-2 mt-4 mx-2 text-gold">
                                {!user?.activated ? 'Please activate your account to continue. Check your email for the activation link.' : 'Start your subscription to continue using Dream Oracles and unlock all the features we offer'}
                            </p>
                            {!user?.subscribed && (<PurchaseButton buttonText={'Start Now'} user={user} />)}
                        </div>
                    )}
                </div>
            </div>
            
            {/* Dream Streak */}
            {dreamStreak && (
                <div className="streak-container text-center mt-4">
                    <h2 className="text-4xl font-bold text-yellow-500">
                        🔥 {dreamStreak.streakLength}-day Dream Streak! 🔥
                    </h2>
                    <p className="text-xl mt-2 text-gray-300">
                        You&apos;re on fire! Keep up the cosmic connection.
                    </p>
                </div>
            )}

            {/* How It Works Section */}
            <h1 className='golden-ratio-3 mt-10 text-center'>How Does It Work?</h1>
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
                    <p className="golden-ratio-1">Read a summary, generate a dream image, and discover detailed insights on your dream, all while saving it all in your dream journal</p>
                </div>
            </div>

            {/* Mandela Image */}
            <div className="image-container text-center mt-4">
                <Image src="/mandela.webp" alt="Mandela" width={500} height={500} className="mandela-image" />
            </div>
        </div>
    );
};

export default WelcomeSection;
