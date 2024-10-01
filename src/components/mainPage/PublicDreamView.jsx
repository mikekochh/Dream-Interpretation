"use client";
import React, { useRef, useEffect, useState } from 'react';
import { gsap } from "gsap";

const PublicDreamView = ({ dreamID }) => {
    // Create a ref for the button
    const buttonRef = useRef(null);
    const pRef = useRef(null);
    const [innerWidthFirst, setInnerWidthFirst] = useState(0);
    const [innerWidthSecond, setInnerWidthSecond] = useState(0);
    const [isPublic, setIsPublic] = useState(true);

    useEffect(() => {
        // Calculate and set the initial innerWidth values
        const firstPosition = window.innerWidth / 4;
        const secondPosition = window.innerWidth - firstPosition - 180; // 160 is size of ball
        setInnerWidthFirst(firstPosition);
        setInnerWidthSecond(secondPosition);

        // Set the button's initial position to 1/3 of the window width
        if (buttonRef.current) {
            gsap.set(buttonRef.current, {
                x: firstPosition,
            });
        }
    }, []);

    const handleButtonClick = () => {
        // Toggle the public/private state
        setIsPublic(!isPublic);

        // GSAP animation for the button
        gsap.to(buttonRef.current, {
            x: isPublic ? innerWidthSecond : innerWidthFirst, // Move across the screen
            duration: 1,
            ease: "back.out",
        });

        gsap.to(buttonRef.current, {
            duration: 0.4,
            ease: "power1.out",
            scaleX: 1.3,
            scaleY: 0.7,
            onComplete: () => {
                gsap.to(buttonRef.current, {
                    scaleX: 1, // Restore original size
                    scaleY: 1,
                    ease: "bounce.out", // Add slight bounce effect when landing
                    duration: 1
                });
            }
        })
    };

    return (
        <div id="public-dream-section">
            <PublicDreamPopup pRef={pRef} />
            <div className={`mb-6`}>
                <button
                    ref={buttonRef} // Attach the ref to the button
                    onClick={handleButtonClick} // Use the animation handler
                    className={`w-40 h-40 mt-5 rounded-full flex items-center justify-center cursor-pointer transition-colors duration-300
                        ${isPublic ? 'bg-black hover:bg-gray-900' : 'bg-white hover:bg-gray-300'}
                    `}
                >
                    <p className={`text-lg font-semibold ${isPublic ? 'text-white' : 'text-black'}`}>
                        {isPublic ? 'Make Private' : 'Make Public'}
                    </p>
                </button>
            </div>
        </div>
    );
};


const PublicDreamPopup = () => {

    const isMobile = window.innerWidth < 768;

    return (
        <div className="justify-center golden-ratio-3 text-center px-1 md:w-2/3 md:mx-auto">
            <div className="flex flex-col justify-center items-center">
                <p className={`gradient-title-text ${isMobile ? 'golden-ratio-3' : 'golden-ratio-4'}`}>Make Dream Public</p>
            </div>
            <div className="inline-flex items-center">
                <p className="golden-ratio-2 mb-2">Add your dream to the dream stream, receive interpretations from the community, and be able to turn your dream into a video</p>
            </div>
            <p className="golden-ratio-2 text-gold font-bold">* Your name and profile will remain anonymous *</p>
        </div>
    )
}

export default PublicDreamView;