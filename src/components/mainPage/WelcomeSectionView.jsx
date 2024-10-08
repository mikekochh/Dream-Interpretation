"use client";
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import PurchaseButton from '../PurchaseButton';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import DreamStream from '../DreamStream';
import EmailReminderForm from '../EmailReminderForm';
import axios from 'axios';

const WelcomeSection = ({ 
    user, 
    dreamStreak, 
    incrementDreamStep, 
    setDream, 
    dream,
    handleScrollToTop
}) => {
    const [isMobile, setIsMobile] = useState(false);
    const [sentEmailVerification, setSentEmailVerification] = useState(false);

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

    const titleRef = useRef(null);
    const subtitleRef = useRef(null);
    const descriptionRef = useRef(null);
    const restOfPageRef = useRef(null);
    const streakRef = useRef(null);
    const howDoesItWorkRef = useRef(null);
    
    // Register the ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);
    
    useEffect(() => {
        const timeline = gsap.timeline();
    
        // Existing animations for the welcome text, title, etc.
        timeline.fromTo(
            titleRef.current, 
            { opacity: 0, y: 50 }, 
            { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
        );
    
        timeline.fromTo(
            subtitleRef.current, 
            { opacity: 0, y: 50 }, 
            { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
            "-=0.5"
        );
    
        timeline.fromTo(
            descriptionRef.current, 
            { opacity: 0, y: 50 }, 
            { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
            "-=0.5"
        );
    
        timeline.fromTo(
            restOfPageRef.current, 
            { opacity: 0, y: 50 }, 
            { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
            "-=0.5"
        );
    
        timeline.fromTo(
            streakRef.current,
            { opacity: 0, x: 50 },
            { opacity: 1, x: 0, duration: 1, ease: "power3.out" },
            "-=0.5"
        );

        timeline.fromTo(
            howDoesItWorkRef.current,
            { opacity: 0, x: 50 },
            { opacity: 1, x: 0, duration: 1, ease: "power3.out" },
            "-=0.5"
        )
    }, []);

    const handleResendVerificationEmail = async () => {
        await axios.post('api/sendVerificationEmail', { email: user?.email });
        setSentEmailVerification(true);
    }

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
                <div ref={restOfPageRef}>
                    <textarea
                        type="text"
                        rows={7}
                        placeholder='Dream goes here'
                        className="DreamBox golden-ratio-2 border-2 p-1 border-black rounded-lg text-black md:m-0 w-full"
                        value={dream}
                        onChange={(event) => setDream(event.target.value)}
                    />
                    {!user || (user?.activated && user?.subscribed) || !user?.usedFreeDream ? (
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
                        <div>
                            {sentEmailVerification ? (
                                <div className="text-center">
                                    <p className="golden-ratio-2 mt-4 mx-2 text-gold">Success! A verification email has been sent. Please check your inbox to complete your profile setup.</p>
                                </div>
                            ) : (
                                <div className='text-center'>
                                    <p className="golden-ratio-2 mt-4 mx-2 text-gold">
                                        {!user?.activated ? 'Please activate your account to continue. Check your email for the activation link.' : user?.usedFreeDream ? 'Start your subscription to continue using Dream Oracles and unlock all the features we offer' : ''}
                                    </p>
                                    {!user?.subscribed && user?.usedFreeDream && user?.activated && (<PurchaseButton buttonText={'Start Now'} user={user} />)}
                                    {!user?.activated && (
                                        <div>
                                            <button className="start-button" onClick={handleResendVerificationEmail}>Resend email</button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                    )}
                    {user?.sendReminder ? (
                        <div className="text-center bg-gray-800 bg-opacity-30 shadow-lg rounded-3xl p-4 mt-5 golden-ratio-2">
                            Dream Reminder Set! See you tomorrow 😁
                        </div>
                    ) : !user ? (<EmailReminderForm />) : (null)}
                    
                </div>
            </div>
            
            {/* Dream Streak */}
            {dreamStreak && (
                <div ref={streakRef} className="streak-container text-center mt-4 mb-10">
                    <h2 className="text-4xl font-bold text-yellow-500">
                        🔥 {dreamStreak.streakLength}-day Dream Streak! 🔥
                    </h2>
                    <p className="text-xl mt-2 text-gray-300">
                        You&apos;re on fire! Keep up the cosmic connection.
                    </p>
                </div>
            )}

            <DreamStream />
            {!user?.sendReminder && (
                <div className="md:mx-auto md:w-2/3"><EmailReminderForm /></div>
            )}
            
            {/* How It Works Section */}
            <div ref={howDoesItWorkRef}>
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
