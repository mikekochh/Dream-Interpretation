"use client";
import React, { useState, useEffect } from 'react';
import { LockClosedIcon, GlobeAltIcon } from '@heroicons/react/24/solid';
import axios from 'axios';

const PublicDreamView = ({ dreamID }) => {
    const [isPublic, setIsPublic] = useState(true);

    useEffect(() => {
        const checkPublicStatus = async () => {
            try {
                const response = await axios.get('api/dream/publicStatus/' + dreamID);
                setIsPublic(response.data.data);
            } catch (error) {
                console.error('Failed to get dreams public status: ', error);
                setIsPublic(true);
            }
        }

        if (dreamID) {
            checkPublicStatus();
        }
    }, [dreamID])

    const handleToggle = async () => {
        try {
            // Optimistically toggle the public/private state
            setIsPublic(!isPublic);

            // Send the POST request to update the dream's public/private status
            await axios.post('api/dream/public', {
                dreamID,
                isPublic: !isPublic
            });
        } catch (error) {
            // If the POST request fails, revert the state back to its original value
            console.error('Failed to update dream visibility:', error);
            setIsPublic(isPublic);  // Revert the state
        }
    };


    return (
        <div id="public-dream-section" className="flex flex-col items-center">
            <PublicDreamPopup isPublic={isPublic} />
            <div className="mt-5">
                <label className="inline-flex items-center cursor-pointer">
                    {/* Hidden checkbox for accessibility */}
                    <input
                        type="checkbox"
                        checked={isPublic}
                        onChange={handleToggle}
                        className="sr-only"
                    />
                    {/* Toggle Switch */}
                    <div
                        className={`relative w-14 h-8 rounded-full mr-2 transition-colors duration-300 ${
                            isPublic ? 'bg-gold' : 'bg-gray-300'
                        }`}
                    >
                        <div
                            className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                                isPublic ? '' : 'translate-x-6'
                            }`}
                        ></div>
                    </div>
                    <span className="mr-3 text-lg font-semibold flex items-center">
                        {isPublic ? (
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
            </div>
        </div>
    );
};

const PublicDreamPopup = () => {
    return (
        <div className="justify-center text-center px-1 md:w-2/3 md:mx-auto">
            <div className="flex flex-col justify-center items-center">
                <p className="golden-ratio-4 gradient-title-text">Make Dream Public</p>
            </div>
            <div className="inline-flex items-center">
                <p className="mb-2 golden-ratio-2">
                    Add your dream to the dream stream and receive interpretations from the community.
                </p>
            </div>
            <p className="text-gold font-bold">* Your name and profile will remain anonymous *</p>
        </div>
    );
};

export default PublicDreamView;
