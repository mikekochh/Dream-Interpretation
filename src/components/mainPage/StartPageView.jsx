"use client";
import React, { useState, useContext } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import PurchaseButton from '../PurchaseButton';
import DreamStreamPreview from '../DreamStreamPreview';
import axios from 'axios';
import { UserContext } from '@/context/UserContext';
import LibraryHomeScreen from '../LibraryHomeScreen';

const StartPageView = ({ 
    dreamStreak, 
    incrementDreamStep, 
    setDream, 
    dream
}) => {
    const [sentEmailVerification, setSentEmailVerification] = useState(false);

    const { user } = useContext(UserContext) || {};

    const handleResendVerificationEmail = async () => {
        await axios.post('api/sendVerificationEmail', { email: user?.email });
        setSentEmailVerification(true);
    }

    return (
        <div>
            <div className="md:w-2/3 md:px-0 px-2 mx-auto" >
                <p className="text-center golden-ratio-2">Welcome back {user?.name}</p>
                <p className="text-center golden-ratio-5 gradient-title-text mb-4">Dream Oracles</p>

                <div className="border border-white rounded-xl p-4 bg-white bg-opacity-10 shadow-2xl">
                    <p className="text-white golden-ratio-2 font-semibold mb-2">
                        Start by entering your dream below
                    </p>
                    <textarea
                        type="text"
                        rows={7}
                        placeholder='Enter your dream here'
                        className="DreamBox golden-ratio-2 p-1 rounded-lg text-black md:m-0 w-full"
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
            <LibraryHomeScreen />
            <DreamStreamPreview />
            {/* Mandela Image */}
            <div className="image-container text-center mt-4">
                <Image src="/mandela.webp" alt="Mandela" width={500} height={500} className="mandela-image" />
            </div>
        </div>
    );
};

export default StartPageView;