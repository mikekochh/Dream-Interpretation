"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function CharacterSelectionForm() {

    const [characters, setCharacters] = useState([]);
    const [selectedCharacter, setSelectedCharacter] = useState(null);

    const { data: session } = useSession();

    const router = useRouter();

    useEffect(() => {
        async function getCharacters() {
            const res = await axios.get('/api/characters');
            setCharacters(res.data);
        }
        getCharacters();
    }, []);

    const isSelected = false;

    const handleCharacterClick = (character) => {
        setSelectedCharacter(character.characterID);
    }

    const saveCharacter = async () => { 
        const email = session?.user?.email;
        const res = await axios.post('/api/characterSelection', { characterID: selectedCharacter, email });
        router.replace("/home");
    }

    return (
        <div className="">
            <div className="text-white text-center">Select Your Character</div>
            <div className="grid grid-cols-2 gap-4">
                {characters.map((character, index) => {

                    const isSelected = selectedCharacter === character.characterID;

                    return (
                        <div key={index} 
                            className={`text-white text-center flex flex-col items-center justify-center cursor-pointer rounded-xl `}
                            onClick={() => handleCharacterClick(character)}
                        >
                            <input type="radio" id={character.characterName} name="character" value={character.characterID} checked={isSelected} onChange={() => {}} style={{ display: 'none'}} />
                            <label htmlFor={character.name} className={`${isSelected ? 'font-bold' : ''}`}>{character.characterName}</label>
                            <Image width={300} height={300} src={character.characterPicture} alt={character.characterName} className={`rounded-xl text-center ${isSelected ? 'border-4 border-blue-500' : ''}`} />
                        </div>
                    )
                })}
            </div>
            <div className="flex justify-center">
                <button className="border-2 border-white p-1 rounded-lg text-white" onClick={saveCharacter}>Save</button>
            </div>
        </div>
        
    )
}