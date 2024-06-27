"use client";
import React from 'react';
import 'reactjs-popup/dist/index.css';
import Image from 'next/image';
import InfoPopup from './InfoPopup';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';

const OracleSection = ({ oracle, handleSelectionChange }) => {
    
    return (
        <div className="text-center relative golden-ratio-1">
            <div className="relative max-w-sm hidden md:block">
                <Image 
                    layout="responsive"
                    width={50}
                    height={50}
                    src={oracle.oraclePicture} 
                    alt={oracle.oracleName} 
                    className={`rounded-xl text-center cursor-pointer ${oracle.selected ? 'border-8 border-gold' : ''}`}
                    onClick={() => handleSelectionChange(oracle.selected, oracle.oracleID)} 
                    htmlFor={oracle.oracleID}
                    draggable={false}
                />
            </div>
            <div className="w-full relative max-w-sm md:hidden oracle-image-mobile">
                <Image 
                    layout="responsive"
                    width={50}
                    height={50}
                    src={oracle.oraclePicture} 
                    alt={oracle.oracleName} 
                    className={`rounded-xl text-center cursor-pointer ${oracle.selected ? 'border-4 border-gold' : ''}`}
                    onClick={() => handleSelectionChange(oracle.selected, oracle.oracleID)} 
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
    )
}

export default OracleSection;
