"use client";
import React from 'react';
import 'reactjs-popup/dist/index.css';
import Image from 'next/image';
import InfoPopup from './InfoPopup';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';

const OracleSection = ({ oracle, handleSelectionChange }) => {

    const imageClasses = `rounded-xl text-center ${oracle.selected ? 'border-8 border-gold' : ''}`;

    const parentClasses = `relative max-w-sm hidden md:block`;

    const handleClick = () => {
        handleSelectionChange(oracle.selected, oracle.oracleID);
    };

    return (
        <div className="text-center relative golden-ratio-1">
            <div className={parentClasses}>
                <Image 
                    layout="responsive"
                    width={50}
                    height={50}
                    src={oracle.oraclePicture} 
                    alt={oracle.oracleName} 
                    className={imageClasses}
                    onClick={handleClick} 
                    htmlFor={oracle.oracleID}
                    draggable={false}
                />
            </div>
            <div className={`w-full relative max-w-sm md:hidden oracle-image-mobile`}>
                <Image 
                    layout="responsive"
                    width={50}
                    height={50}
                    src={oracle.oraclePicture} 
                    alt={oracle.oracleName} 
                    className={imageClasses}
                    onClick={handleClick} 
                    htmlFor={oracle.oracleID}
                />
            </div>
            <div className="flex items-center justify-center mt-2 golden-ratio-1">
                <label htmlFor={oracle.oracleID} className={`${oracle.selected ? "text-gold" : ""}`}>
                    {oracle.oracleName}            
                </label>
                <InfoPopup 
                    icon={faQuestionCircle} 
                    infoText={oracle.oracleDescriptionShort}
                    infoTitle={`${oracle.oracleName}<br/>${oracle.oracleSpecialty}`}
                />
            </div>
        </div>
    );
}

export default OracleSection;
