"use client";
import React from "react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";


const StarBackground = ({ children }) => {

    const pathname = usePathname();
    const [showFeedbackButton, setShowFeedbackButton] = useState(true);
    const { data: session } = useSession();

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

    // useEffect(() => {
    //     if (pathname === "/feedback" || !session) {
    //         setShowFeedbackButton(false);
    //     }
    //     else {
    //         setShowFeedbackButton(true);
    //     }
    // }, [pathname, session]);

    const feedback = function() {
        window.location.href = "/feedback";
    }

    return (
        <div className="star-background relative">
            {children}
            {showFeedbackButton && <button className="absolute left-0 bottom-0 dream-button" onClick={feedback}>Feedback</button>}
        </div>
    );
}

export default StarBackground;