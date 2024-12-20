"use client";
import React from 'react';
import LoadingComponent from '../LoadingComponent';

const QuestionsPreview = () => {
    return (
        <div className="flex justify-center items-center flex-col h-screen">
            <div className="p-6 rounded-lg">
                <h1 className="gradient-title-text golden-ratio-4 text-center">Dream Questions</h1>
                <p className="text-center text-gray-100 golden-ratio-2 md:w-2/3 md:mx-auto">
                    We&apos;re genertaing questions to understand the context of your dream and uncover its deeper meaning. Answer however you like, and feel free to skip any questions.
                </p>
            </div>
            <LoadingComponent loadingText={"Generating Questions"} altScreen={true} />
        </div>

    );
};

export default QuestionsPreview;
