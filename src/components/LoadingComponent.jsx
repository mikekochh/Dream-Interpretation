"use client";
import React, { useState, useEffect } from 'react';

const LoadingComponent = ({ loadingText, altScreen }) => {
    const [displayedText, setDisplayedText] = useState(loadingText);
    const [fadeState, setFadeState] = useState("fade-in");

    useEffect(() => {
        // Trigger fade-out when the loadingText changes
        setFadeState("fade-out");

        const timeout = setTimeout(() => {
            // After fade-out, update the text and fade-in
            setDisplayedText(loadingText);
            setFadeState("fade-in");
        }, 300); // Duration should match the CSS transition time

        // Clean up the timeout to prevent memory leaks
        return () => clearTimeout(timeout);
    }, [loadingText]);

    return (
        <div className={`main-content text-white ${altScreen ? '' : 'flex justify-center items-center h-screen'}`}>
            <div className='loadingContainer'>
                <p className={`loadingText ${fadeState}`}>{displayedText}</p>
                <div className='dotsContainer'>
                    <div className='dot delay200'></div>
                    <div className='dot delay400'></div>
                    <div className='dot'></div>
                </div>
            </div>
        </div>
    );
};

export default LoadingComponent;
