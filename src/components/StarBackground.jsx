"use client";
import React from "react";
import { useEffect } from "react";

const StarBackground = ({ children }) => {

    useEffect(() => {
        let top = false;

        const interval = setInterval(() => {
            const starBackground = document.querySelector('.star-background');
            const star = document.createElement('span');
            star.className = 'shooting-star';

            // Randomize position
            const topPosition = Math.random() * window.innerHeight;
            const rightPosition = Math.random() * window.innerWidth;

            // Set position
            star.style.top = `${topPosition}px`;
            star.style.right = `${rightPosition}px`;

            if (top) {
                star.style.right = '0px';
                top = false;
            }
            else {
                star.style.top = `0px`;
                top = true;
            }

            // Append and remove star
            starBackground.appendChild(star);
            setTimeout(() => star.remove(), 5000); // Adjust based on animation duration
        }, 5000); // Creates a new star every 30 seconds

        // Cleanup interval on component unmount
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="star-background relative">
            {children}
        </div>
    );
}

export default StarBackground;