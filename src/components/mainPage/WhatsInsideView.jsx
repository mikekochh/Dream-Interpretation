"use client";
import React from 'react';
import { useRouter } from 'next/navigation';

const WhatsInsideView = ({ handleScrollToTop }) => {
    const router = useRouter();
    const sections = [
        {
            title: "Smartest AI Models Available",
            description: "We are using the most cutting-edge AI intelligence models to help you interpret your dreams.",
            imageSrc: "/baseModel.webp"
        },
        {
            title: "Diverse Interpretations",
            description: "Experience varied approaches to dream analysis with oracles offering Jungian, Freudian, and other unique perspectives.",
            imageSrc: "/Jung.webp"
        },              
        {
            title: "Dream Journal",
            description: "Keep all your dreams and interpretations in one place with our comprehensive dream journaling software.",
            imageSrc: "/imageJournal.webp"
        },
        {
            title: "Community",
            description: "Share your dreams with other like-minded dreamers to gain different perspectives and help others understand theirs.",
            imageSrc: "/imageCommunity.webp"
        }
    ];

    return (
        <div className="md:w-3/4 mx-auto px-3 py-12 bg-transparent">
            <h3 className="text-center font-thin text-xl text-gray-200">What&apos;s Inside?</h3>
            <h2 className="text-center golden-ratio-4 gradient-title-text mb-2">The Dream Oracles Platform</h2>
            <h3 className="text-center mb-10 text-lg text-gray-100">An all-in-one interpretation tool to help you understand what your dreams are trying to tell you.</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {sections.map((section, index) => (
                    <div 
                        key={index} 
                        className="p-4 border border-gray-300 rounded-lg shadow-md bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 hover:shadow-lg transition-shadow flex flex-col items-center"
                    >
                        <img src={section.imageSrc} alt={section.title} className="w-full h-32 object-cover rounded mb-4" />
                        <h4 className="text-xl font-semibold text-gray-100 mb-3 text-center">{section.title}</h4>
                        <p className="text-gray-300 text-sm text-center">{section.description}</p>
                    </div>
                ))}
            </div>

            <div className="text-center mt-10">
                <button className="start-button" onClick={handleScrollToTop}>Try It Out</button>
                <button className="secondary-button" onClick={() => router.push('/register')}>Join Now</button>
            </div>
        </div>
    );
}

export default WhatsInsideView;
