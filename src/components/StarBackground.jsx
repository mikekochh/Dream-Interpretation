"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const StarBackground = ({ children }) => {
    const router = useRouter();

    const privacyNotice = () => {
        router.push("/privacyNotice");
    }

    const contactMe = () => {
        router.push("/contactMe");
    }

    useEffect(() => {

        console.log("useEffect called");

        let top = false;

        const interval = setInterval(() => {
            console.log("setInterval called");
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
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-white text-center">
                <button className="underline p-1" onClick={privacyNotice}>Privacy Notice</button>
                <button className="underline p-1" onClick={contactMe}>Contact Me</button>
            </div>
        </div>
    );
}

export default StarBackground;