"use client";
import React from 'react';

const LoadingComponent = ({ loadingText, altScreen }) => {
    return (
        <div className={`main-content text-white ${altScreen ? '' : 'flex justify-center items-center h-screen'}`}>
            <div className='loadingContainer'>
                <p className='loadingText'>{loadingText}</p>
                <div className='dotsContainer'>
                    <div className='dot delay200'></div>
                    <div className='dot delay400'></div>
                    <div className='dot'></div>
                </div>
            </div>
        </div>
    )
}

export default LoadingComponent;