"use client";
import React, { useState } from 'react';
import 'reactjs-popup/dist/index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';

const OracleSection = ({ oracle, handleSelectionChange }) => {

    const [open, setOpen] = useState(false);
    
    return (
        <div className="text-center whitespace-nowrap relative golden-ratio-1">
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
                />
            </div>
            <div className="w-full relative max-w-sm md:hidden oracle-image-mobile">
                <Image 
                    layout="responsive"
                    width={100}
                    height={100}
                    src={oracle.oraclePicture} 
                    alt={oracle.oracleName} 
                    className={`rounded-xl text-center cursor-pointer ${oracle.selected ? 'border-4 border-gold' : ''}`}
                    onClick={() => handleSelectionChange(oracle.selected, oracle.oracleID)} 
                    htmlFor={oracle.oracleID}
                />
            </div>
            <label htmlFor={oracle.oracleID} className={`${oracle.selected ? "text-gold" : ""}`}>
                {oracle.oracleName}<FontAwesomeIcon icon={faInfoCircle} className="ml-2 cursor-pointer" onClick={() => setOpen(o => !o)} />
                <div className={`whitespace-pre-wrap ${open ? 'oracle-menu-active' : 'oracle-menu'}`}>
                    <p>
                        <b>Specialty: </b>{oracle.oracleSpecialty}<br/><br/>
                        {oracle.oracleDescriptionShort}
                    </p>
                </div>
            </label>
        </div>
    )
}

export default OracleSection;