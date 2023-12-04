"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { useSearchParams } from 'next/navigation';
import axios from 'axios';

export default function DreamsForm() { 

    const searchParams = useSearchParams();
 
    const dreamID = searchParams.get('dreamID');

    const [dreamDetails, setDreamDetails] = useState([]);
    const [characters, setCharacters] = useState([]);

    useEffect(() => {

        const getDreamDetails = async () => {
            console.log("dreamID", dreamID);
            const res = await axios.get('api/dream/details/' + dreamID);
            console.log("res", res);   
            setDreamDetails(res.data.dreamDetails);
        }   

        async function getCharacters() {
            const res = await axios.get('/api/characters');
            setCharacters(res.data);
        }

        getCharacters();
        getDreamDetails();
    }, []);

    console.log("dreamDetails:", dreamDetails);
    if (dreamDetails) {
        console.log("length:", dreamDetails.length);
    }

    const formatInterpretationDate = (dreamDate) => {
        const date = new Date(dreamDate);
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const year = date.getFullYear();
        return month + "/" + day + "/" + year;
    }

    const getCharacterName = (characterID) => {
        const character = characters.find(character => character.characterID === characterID);
        return character.characterName;
    }

    const insertLineBreaks = (text) => {
        const lines = text.split('\n');
        return lines.map((line, index) => (
          <React.Fragment key={index}>
            {line}
            {index < lines.length - 1 && <br />}
          </React.Fragment>
        ));
    }

    return (
        <div>
            <div className="text-white main-content">Hello from Dream Details {dreamID}</div>
            {dreamDetails && characters && (
                dreamDetails.map((detail) => (
                    <div 
                        key={detail._id} 
                        className="flex flex-col items-center justify-center text-white border-white border m-2 rounded-xl cursor-pointer"
                    >
                        <div className="pl-10">
                            <p>
                                <span className="font-bold">Interpretation Date: </span>{formatInterpretationDate(detail.interpretationDate)}
                            </p>
                            <p>
                                <span className="font-bold">Character: </span>{getCharacterName(detail.characterID)}
                            </p>
                            <p>
                                <span className="font-bold">Interpretation: </span>{insertLineBreaks(detail.interpretation)}
                            </p>
                        </div>
                    </div>
                )
            ))}
        </div>
    )
}