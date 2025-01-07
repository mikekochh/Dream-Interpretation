"use client";
import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';

const LoadingComponent = ({ loadingText, altScreen, altText }) => {
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
        <div className={`text-white ${altScreen ? '' : 'main-content flex justify-center items-center h-screen'}`}>
            <div className='loadingContainer'>
                {/* Attach the ref to the <p> tag */}
                {/* <p ref={textRef} className='loadingText'>{displayedText}</p> */}
                <p ref={textRef} className='loadingText p-4 pb-0'>Interpreting Your Dream</p>
                <p className="mb-5">{altText}</p>
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
