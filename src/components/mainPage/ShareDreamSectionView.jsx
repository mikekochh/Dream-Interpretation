"use client";
import React from 'react';

const ShareDreamSection = ({ setDream, dream, error, incrementDreamStep }) => {
    return (
        <div className="main-content">
            <HowItWorksPopup />
            <div className="flex flex-col items-center">
                <textarea
                    type="text"
                    rows={7}
                    placeholder='Dream goes here'
                    className="DreamBox golden-ratio-2 border-2 p-1 border-black rounded-lg text-black  md:m-0 m-2 w-full"
                    value={dream}
                    onChange={(event) => setDream(event.target.value)}
                />
            </div>
            {error && <div className="bg-red-500 w-max p-1 text-black font-bold rounded-xl whitespace-nowrap">{error}</div>}
            <div className="button-container">
                <button
                    className={`start-button golden-ratio-1 ${!dream.trim() ? 'disabled-button' : ''}`}
                    onClick={incrementDreamStep}
                    disabled={!dream.trim()}
                >
                    Continue
                </button>
            </div>
        </div>
    )
}

const HowItWorksPopup = () => {

    const isMobile = window.innerWidth < 768;

    return (
        <div className="justify-center golden-ratio-3 text-center px-1">
            <div className="flex flex-col justify-center items-center golden-ratio-2">
                <p className={`gradient-title-text ${isMobile ? 'golden-ratio-3' : 'golden-ratio-4'}`}>Share Your Dream</p>
            </div>
            <div className="inline-flex items-center">
                <p className="golden-ratio-2 mb-3">Write down everything that you remember and try to include as many details as possible</p>
            </div>
        </div>
    )
};

export default ShareDreamSection;