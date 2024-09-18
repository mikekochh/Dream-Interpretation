"use client";
import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';

const LoadingComponent = ({ loadingText, altScreen }) => {
    const [displayedText, setDisplayedText] = useState(loadingText);
    const textRef = useRef(null);

    useEffect(() => {
        if (textRef.current) {
            // Create a GSAP timeline for a smooth animation sequence
            const tl = gsap.timeline();

            // Animate the text out
            tl.to(textRef.current, {
                duration: 0.3,
                y: -20,
                opacity: 0,
                ease: "power1.out",
                onComplete: () => {
                    // Update the text after the animation
                    setDisplayedText(loadingText);
                },
            });

            // Animate the text in
            tl.fromTo(
                textRef.current,
                { y: 20, opacity: 0 },
                { duration: 0.3, y: 0, opacity: 1, ease: "power1.in" }
            );
        }
    }, [loadingText]);

    return (
        <div className={`main-content text-white ${altScreen ? '' : 'flex justify-center items-center h-screen'}`}>
            <div className='loadingContainer'>
                {/* Attach the ref to the <p> tag */}
                <p ref={textRef} className='loadingText'>{displayedText}</p>
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
