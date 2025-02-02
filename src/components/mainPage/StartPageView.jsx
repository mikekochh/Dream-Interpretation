"use client";
import React, { useState, useContext, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import PurchaseButton from '../PurchaseButton';
import DreamStreamPreview from '../DreamStreamPreview';
import axios from 'axios';
import { UserContext } from '@/context/UserContext';
import LibraryHomeScreen from '../LibraryHomeScreen';
import { RecoilRoot } from 'recoil';
import DreamSymbolsProvider from "@/components/Providers/DreamSymbolsProvider";
import DreamArticles from '../DreamArticles';

const StartPageView = ({ 
    dreamStreak, 
    incrementDreamStep, 
    setDream, 
    dream,
    handleScrollToTop
}) => {
    const [sentEmailVerification, setSentEmailVerification] = useState(false);

    const { user } = useContext(UserContext) || {};

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

    const handleResendVerificationEmail = async () => {
        await axios.post('api/sendVerificationEmail', { email: user?.email });
        setSentEmailVerification(true);
    }

    return (
        <div>
            <div className="md:w-2/3 md:px-0 px-2 mx-auto">
                {user && (<h3 className="text-center font-thin golden-ratio-2 text-gray-200">Welcome back {user.name}</h3>)}
                <h1 className="text-center text-4xl md:text-5xl gradient-title-text">Dream Interpretation AI</h1>
                <h3 className="text-center text-xl md:texxt-2xl">
                    Understand your dreams like never before with our dream interpretation AI, turning dreams into insights
                    for self-awareness, growth, and clarity.
                </h3>

                <div className="border border-white rounded-xl py-4 px-2 md:p-4 bg-white bg-opacity-10 shadow-2xl mt-4">
                    <p className="text-white text-xl font-semibold mb-2">
                        Start by entering your dream below
                    </p>
                    <textarea
                        type="text"
                        rows={isMobile ? 12 : 7}
                        placeholder='Enter your dream here'
                        className="DreamBox text-xl p-1 rounded-lg text-black md:m-0 w-full"
                        value={dream}
                        onChange={(event) => setDream(event.target.value)}
                    />
                </div>



                {/* 4. Rest of the page */}
                <div className="mt-4">
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
                </div>
            </div>
            {!user && (
                <div>
                    <div>
                        <h1 className='text-4xl md:text-5xl gradient-title-text mt-10 text-center'>How Does It Work?</h1>
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
                </div>
            )}
            {user?.sendReminder && (
                <div className="text-center bg-gray-800 bg-opacity-30 shadow-lg rounded-3xl p-4 mt-5 golden-ratio-2 md:w-2/3 md:mx-auto">
                    Dream reminder set! See you tomorrow 😁
                </div>
            )} 

            
            {/* Dream Streak */}
            {dreamStreak && (
                <div className="streak-container text-center mt-4 mb-10">
                    <h2 className="text-4xl font-bold text-yellow-500">
                        🔥 {dreamStreak.streakLength}-day Dream Streak! 🔥
                    </h2>
                    <p className="text-xl mt-2 text-gray-300">
                        You&apos;re on fire! Keep up the cosmic connection.
                    </p>
                </div>
            )}

            <DreamArticles />

            <RecoilRoot>
                <DreamSymbolsProvider>
                    <LibraryHomeScreen />
                </DreamSymbolsProvider>
            </RecoilRoot>
            
            <DreamStreamPreview />
            {/* Mandela Image */}
            <div className="image-container text-center mt-4">
                <Image src="/mandela.webp" alt="Mandela" width={500} height={500} className="mandela-image" />
            </div>
        </div>
    );
};

export default StartPageView;