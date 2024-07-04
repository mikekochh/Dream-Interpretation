"use client";
import React from "react";
import { useEffect } from "react";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const StarBackground = ({ children }) => {
    const pathname = usePathname();

    useEffect(() => {

        const interval = setInterval(() => {
            const starBackground = document.querySelector('.star-background');
            const star = document.createElement('span');
            star.className = 'shooting-star';

            const rightPosition = Math.random() * window.innerWidth;

            // Set position
            star.style.top = `0px`;
            star.style.right = `${rightPosition}px`;

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
            {pathname !== '/feedback' ? (
                <Link
                    className="absolute left-0 bottom-0 dream-button golden-ratio-1 z-10"
                    href={'/feedback'}
                >
                    Give us Feedback
                </Link>
            ) : (
                <Link
                    className="absolute left-0 bottom-0 dream-button golden-ratio-1 z-10"
                    href={'/interpret'}
                >
                    Back Home
                </Link>
            )}
        </div>
    );
}

export default StarBackground;