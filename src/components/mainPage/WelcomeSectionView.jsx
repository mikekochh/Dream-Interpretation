"use client";
import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import PurchaseButton from '../PurchaseButton';
import axios from 'axios';

const WelcomeSection = ({ user, dreamStreak, incrementDreamStep, skipToDreamStep, setDream, mostRecentDream }) => {

    const isMobile = window.innerWidth < 768;

    return (
        <div>
            {user?.name ? (
                <WelcomeBackPageSection 
                    user={user} 
                    dreamStreak={dreamStreak} 
                    incrementDreamStep={incrementDreamStep} 
                    skipToDreamStep={skipToDreamStep} 
                    setDream={setDream}
                    isMobile={isMobile}
                    mostRecentDream={mostRecentDream}
                />
            ) : (
                <WelcomePageSection incrementDreamStep={incrementDreamStep} isMobile={isMobile} />
            )}
        </div>
    );
}

const WelcomeBackPageSection = ({ incrementDreamStep, dreamStreak, user, skipToDreamStep, setDream, isMobile, mostRecentDream }) => {

    const interpretRecentDream = () => {
        setDream(mostRecentDream.dream);
        skipToDreamStep(3);
    }

    const runMetaAnalysis = async () => {
        console.log("running meta-analysis...");
        const res = await axios.post('api/dream/metaAnalysis');
        console.log("res: ", res);
    }

    return (
        <div className="title-container">
            <div className="content-wrapper">
                <p className="text-center golden-ratio-5 gradient-title-text pb-2">Dream Oracles</p>
                <p className="text-center golden-ratio-2">Welcome back {user?.name}</p>
                {dreamStreak && dreamStreak.streakLength > 0 ? (
                    <p className="text-center golden-ratio-2">{dreamStreak.streakLength} Day Dream Streak</p>
                ) : (
                    <p className='text-center golden-ratio-1'>Journal a Dream to Start your Dream Streak</p>
                )}
                {user?.activated ? (
                    <div>
                        {user?.subscribed ? (
                            <div className="button-container">
                                <button className='start-button golden-ratio-1' onClick={incrementDreamStep}>
                                    Journal New Dream
                                </button>
                            </div>
                        ) : (
                            <div>
                                <p className="golden-ratio-2 mt-4 mx-2 text-gold">Start your subscription to continue using Dream Oracles and unlock all the features we offer.</p>
                                <div className="flex justify-center mt-4">
                                    <PurchaseButton buttonText={"Start Now"} user={user} />
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div>
                        <div className="button-container">
                            <button className='start-button golden-ratio-1 disabled-button' onClick={null} disabled={true}>
                                Journal New Dream
                            </button>
                        </div>
                        <div className="text-center text-gold golden-ratio-1 mt-5">
                            <p className="font-bold">
                                Please activate your account to continue. Check your email for the activation link.
                            </p>
                            <Link href={`/emailVerification?email=${user?.email}`} className="underline">Didn&apos;t receive the verification email?</Link>
                        </div>
                    </div>
                )}
                <div className="mt-4 mb-10 border border-white rounded-3xl p-4 w-5/6 md:w-2/3 bg-black bg-opacity-40 backdrop-filter">
                    <p className='golden-ratio-2'>Your Most Recent Dream Entry</p>
                    <p className='golden-ratio-1'>{mostRecentDream.dream}</p>
                    <div className="flex justify-center">
                        <Link 
                            className={`mx-2 z-10 ${isMobile ? 'start-button-mobile' : 'start-button'}`}
                            href={`/dreamDetails?dreamID=${mostRecentDream._id}`}
                            style={{ whiteSpace: 'nowrap' }}
                        >
                            View Dream Board
                        </Link>
                        {!mostRecentDream.interpretation && (
                            <button 
                                className={`mx-2 z-10 ${isMobile ? 'start-button-mobile' : 'start-button'}`}
                                onClick={interpretRecentDream}
                                style={{ whiteSpace: 'nowrap' }}
                            >
                                Interpret This Dream
                            </button>
                        )}
                    </div>
                </div>
                <div className="z-10">
                    <button onClick={runMetaAnalysis} className="start-button z-10">Meta-Analysis</button>
                </div>
            </div>
            <div className="image-container-mandela text-center">
                <Image src="/mandela.webp" alt="Mandela" width={500} height={500} className="mandela-image" />
            </div>
        </div>
    );
};

const WelcomePageSection = ({ incrementDreamStep, isMobile }) => {
    const titleRef = useRef(null);
    const descriptionRef = useRef(null);

    useEffect(() => {
        if (titleRef.current && descriptionRef.current) {
            const titleWidth = titleRef.current.offsetWidth;
            const adjustedWidth = titleWidth - 40; // Adjust the width to be smaller by 40px
            descriptionRef.current.style.width = `${adjustedWidth}px`;
        }
    }, []);

    return (
        <div className="title-container">
            <p className="text-center golden-ratio-2">Welcome to</p>
            <p ref={titleRef} className="text-center golden-ratio-5 gradient-title-text pb-2">Dream Oracles</p>
            <p ref={descriptionRef} className="text-center golden-ratio-2 match-width">
                Interpret your dreams using our intelligent dream interpretation AI models
            </p>
            <div className="button-container">
                <button className="start-button golden-ratio-1" onClick={incrementDreamStep}>Interpret Your Dream</button>
            </div>
            <Link href="/login" className="text-gold golden-ratio-1 underline">Already Have Account?</Link>
            <div>
                <h1 className='golden-ratio-3 mt-10'>How Does It Work?</h1>
            </div>
            {isMobile ? (
                <div className="image-container flex flex-col">
                    <div className="step-section-mobile border-bottom mb-4">
                        <Image src="/ShareDreamStep.svg" alt="Step 1" width={100} height={100} className="step-image-mobile" />
                        <p className="golden-ratio-1 center-text">Step 1</p>
                        <p className="golden-ratio-2 center-text">Share your dream</p>
                        <p className="golden-ratio-1 center-text">Write down everything that you remember and try to include as many details as possible</p>
                    </div>
                    <div className="step-section-mobile border-bottom mb-4">
                        <Image src="/OracleStep.svg" alt="Step 2" width={100} height={100} className="step-image-mobile" />
                        <p className="golden-ratio-1 center-text">Step 2</p>
                        <p className="golden-ratio-2 center-text">Choose an Oracle</p>
                        <p className="golden-ratio-1 center-text">Select a dream oracle, with each oracle being one of our intelligent AI interpretation models</p>
                    </div>
                    <div className="step-section-mobile">
                        <Image src="/LearnStep.svg" alt="Step 3" width={100} height={100} className="step-image-mobile" />
                        <p className="golden-ratio-1 center-text">Step 3</p>
                        <p className="golden-ratio-2 center-text">Learn about your dream</p>
                        <p className="golden-ratio-1 center-text">Read a summary and discover detailed insights on your dream, while saving it all in your dream journal</p>
                    </div>
                </div>
            ) : (
                <div className="image-container flex flex-row">
                    <div className="step-section border-right mr-4">
                        <Image src="/ShareDreamStep.svg" alt="Step 1" width={50} height={50} className="step-image" />
                        <p className="golden-ratio-1">Step 1:</p>
                        <p className="golden-ratio-2">Share your dream</p>
                        <p className="golden-ratio-1">Write down everything that you remember and try to include as many details as possible</p>
                    </div>
                    <div className="step-section border-right mr-4">
                        <Image src="/OracleStep.svg" alt="Step 2" width={50} height={50} className="step-image" />
                        <p className="golden-ratio-1">Step 2:</p>
                        <p className="golden-ratio-2">Choose an Oracle</p>
                        <p className="golden-ratio-1">Select a dream oracle, with each oracle being one of our intelligent AI interpretation models</p>
                    </div>
                    <div className="step-section">
                        <Image src="/LearnStep.svg" alt="Step 3" width={50} height={50} className="step-image" />
                        <p className="golden-ratio-1">Step 3:</p>
                        <p className="golden-ratio-2 reduce-line-spacing">Learn about your dream</p>
                        <p className="golden-ratio-1">Read a summary and discover detailed insights on your dream, while saving it all in your dream journal</p>
                    </div>
                </div>
            )}
            <div className="button-container">
                <button className="start-button golden-ratio-1" onClick={incrementDreamStep}>Interpret Your Dream</button>
            </div>
            <Link href="/login" className="text-gold golden-ratio-1 underline">Already Have Account?</Link>
            <div className="image-container text-center mt-4">
                <Image src="/mandela.webp" alt="Mandela" width={500} height={500} className="mandela-image" />
            </div>
        </div>
    );
};

export default WelcomeSection;