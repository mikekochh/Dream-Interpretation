"use client";
import React from 'react';

const MoodSection = ({ emotions, handleEmotionClick, selectedEmotions, incrementDreamStep }) => {
    return (
        <div id="mood-selection-section">
            <MoodSelectionPopup />
            <div className="flex flex-wrap gap-2 justify-center md:w-3/4 md:mx-auto">
                {emotions.map(emotion => (
                    <button
                        key={emotion.emotionID}
                        onClick={() => handleEmotionClick(emotion.emotionID)}
                        className={`px-4 py-2 rounded-lg transition text-black ${selectedEmotions?.includes(emotion.emotionID) ? 'border-4 border-gold bg-gray-400 hover:bg-gray-200' : 'bg-gray-200 hover:bg-gray-400'}`}
                    >
                        {emotion.emotionName}
                    </button>
                ))}
            </div>
            <div className="button-container">
                <button className="start-button golden-ratio-1" onClick={incrementDreamStep}>Continue</button>
            </div>
        </div>
    )
}

const MoodSelectionPopup = () => {

    const isMobile = window.innerWidth < 768;

    return (
        <div className="justify-center golden-ratio-3 text-center px-1">
            <div className="flex flex-col justify-center items-center">
                <p className={`gradient-title-text ${isMobile ? 'golden-ratio-4' : 'golden-ratio-5'}`}>Mood Board</p>
            </div>
            <div className="inline-flex items-center">
                <p className="golden-ratio-2 mb-7">What emotions did you experience during and after your dream? (optional)</p>
            </div>
        </div>
    )
}

export default MoodSection;