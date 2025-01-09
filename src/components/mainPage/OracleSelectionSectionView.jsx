"use client";
import React, { Suspense } from 'react';
import OracleSection from '../OracleSection';

const OracleSelectionSection = ({
    user,
    oracles,
    handleSelectionChange,
    journalDream,
    buttonText,
    selectedOracle
}) => {

    console.log("selectedOracle: ", selectedOracle);

    return (
        <div id="interpretation-section" className="relative">
            <OracleSelectionPopup user={user} />
            <div className="flex items-center justify-center relative">
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 md:flex md:overflow-x-visible md:flex-row">
                    {oracles.filter((oracle) => oracle.active).map((oracle, index, arr) => (
                        <div
                            key={oracle._id}
                            className={`mx-2 ${index === arr.length - 1 && arr.length % 2 !== 0 ? "col-span-2 place-self-center" : ""}`}
                        >
                            <Suspense fallback={<div />}>
                                <OracleSection oracle={oracle} handleSelectionChange={handleSelectionChange} />
                            </Suspense>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex flex-col items-center">
                <button
                    className={`start-button ${!selectedOracle ? 'disabled-button' : ''}`}
                    onClick={journalDream}
                    disabled={!selectedOracle}
                >
                    {buttonText}
                </button>
            </div>
        </div>
    )
}

const OracleSelectionPopup = ({ user }) => {

    const isMobile = window.innerWidth < 768;

    return (
        <div className="justify-center golden-ratio-3 text-center px-1">
            <div className="flex flex-col justify-center items-center golden-ratio-2">
                <p className={`gradient-title-text text-4xl md:text-5xl`}>Choose an Oracle</p>
            </div>
            <div className="inline-flex items-center flex-col mb-3">
                <p className="text-xl">Select a Dream Oracle, with each taking you on a different journey of interpretation</p>
            </div>
        </div>
    )
}

export default OracleSelectionSection;