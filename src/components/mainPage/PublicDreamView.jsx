"use client";
import React from 'react';
import { LockClosedIcon, GlobeAltIcon } from '@heroicons/react/24/solid';
import axios from 'axios';

const PublicDreamView = ({ incrementDreamStep, publicDream, setPublicDream }) => {

    const handleToggle = async () => {
        setPublicDream(!publicDream);
    };


    return (
        <div id="public-dream-section" className="flex flex-col items-center">
            <PublicDreamPopup publicDream={publicDream} />
            <div className="mt-5">
                <label className="inline-flex items-center cursor-pointer">
                    {/* Hidden checkbox for accessibility */}
                    <input
                        type="checkbox"
                        checked={publicDream}
                        onChange={handleToggle}
                        className="sr-only"
                    />
                    {/* Toggle Switch */}
                    <div
                        className={`relative w-14 h-8 rounded-full mr-2 transition-colors duration-300 ${
                            publicDream ? 'bg-gold' : 'bg-gray-300'
                        }`}
                    >
                        <div
                            className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                                publicDream ? '' : 'translate-x-6'
                            }`}
                        ></div>
                    </div>
                    <span className="mr-3 text-lg font-semibold flex items-center">
                        {publicDream ? (
                            <>
                                <GlobeAltIcon className="h-5 w-5 mr-1 text-gold" />
                                Public
                            </>
                        ) : (
                            <>
                                <LockClosedIcon className="h-5 w-5 mr-1 text-gray-500" />
                                Private
                            </>
                        )}
                    </span>
                </label>
                <div>
                    <button className="start-button" onClick={incrementDreamStep}>Continue</button>
                </div>
            </div>
        </div>
    );
};

const PublicDreamPopup = () => {
    return (
        <div className="justify-center text-center px-1 md:w-2/3 md:mx-auto">
            <div className="flex flex-col justify-center items-center">
                <p className="text-4xl md:text-5xl gradient-title-text">Make Dream Public</p>
            </div>
            <div className="inline-flex items-center">
                <p className="mb-2 text-xl">
                    Add your dream to the dream stream and receive interpretations from the community.
                </p>
            </div>
            <p className="text-gold font-bold">* Your name and profile will remain anonymous *</p>
        </div>
    );
};

export default PublicDreamView;
