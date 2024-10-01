// ToggleSwitch.jsx
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';

const ToggleSwitch = ({ defaultState = 'Public', onToggle }) => {
    const [isPublic, setIsPublic] = useState(defaultState === 'Public');
    const toggleRef = useRef(null);
    const knobRef = useRef(null);
    const labelRef = useRef(null);

    const handleToggle = () => {
        setIsPublic(prev => !prev);
        if (onToggle) onToggle(!isPublic ? 'Public' : 'Private');
    };

    useEffect(() => {
        // Adjust the x translation based on the new width
        const toggleWidth = toggleRef.current.clientWidth; // e.g., 96px
        const knobWidth = knobRef.current.clientWidth; // e.g., 48px
        const maxX = toggleWidth - knobWidth - 4; // 4px padding

        gsap.to(knobRef.current, {
            x: isPublic ? 0 : maxX,
            duration: 0.5,
            ease: 'power2.out',
        });

        // Animate the background color
        gsap.to(toggleRef.current, {
            backgroundColor: isPublic ? '#4ade80' : '#f87171', // Green for public, red for private
            duration: 0.5,
            ease: 'power2.out',
        });

        // Animate the label text with fade effect
        gsap.to(labelRef.current, {
            opacity: 0,
            duration: 0.25,
            onComplete: () => {
                labelRef.current.textContent = isPublic ? 'Public' : 'Private';
                gsap.to(labelRef.current, { opacity: 1, duration: 0.25 });
            },
        });
    }, [isPublic]);

    return (
        <div
            ref={toggleRef}
            onClick={handleToggle}
            className="toggle-switch cursor-pointer relative w-24 h-12 flex items-center bg-green-500 rounded-full p-1 transition-colors duration-300"
        >
            <div
                ref={knobRef}
                className="knob bg-white w-12 h-12 rounded-full shadow-md"
            ></div>
            <span
                ref={labelRef}
                className="absolute text-white text-lg font-semibold left-1/2 transform -translate-x-1/2"
            >
                Public
            </span>
        </div>
    );
};

export default ToggleSwitch;
