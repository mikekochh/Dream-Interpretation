"use client";
import React from 'react';

const InterpretingDreamView = ({ oracles, interpretationProgressArray, progressBarClass }) => (
    <div>
        <div className='loadingContainer'>
            <p className='loadingText'>Please wait while we interpret your dream</p>
            <div className='dotsContainer'>
                <div className='dot delay200'></div>
                <div className='dot delay400'></div>
                <div className='dot'></div>
            </div>
        </div>
        <div className="flex flex-col items-center w-full">
            {oracles.map((oracle, index) => (
                oracle.selected && (
                    <div key={oracle._id} className="flex flex-col items-center max-w-lg w-full">
                        <div className="w-full md:text-left text-center">{oracle.oracleName}</div>
                        <div className="progress-bar-container w-full flex justify-center">
                            <div className={`progress-bar ${progressBarClass}`}>
                                <div className="progress-bar-inside" style={{ width: `${interpretationProgressArray[index]}%` }}>
                                    Interpreting...
                                </div>
                            </div>
                        </div>
                    </div>
                )
            ))}
        </div>
    </div>
);

export default InterpretingDreamView;