"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function CharacterSelectionForm() {

    const [characters, setCharacters] = useState([]);
    const [selectedCharacter, setSelectedCharacter] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [cancelVisible, setCancelVisible] = useState(false);

    const { data: session } = useSession();

    const router = useRouter();

    useEffect(() => {
        async function getCharacters() {
            const res = await axios.get('/api/characters');
            setCharacters(res.data);
        }
        getCharacters();
    }, []);

    useEffect(() => {
        async function getUser() {
            const email = session?.user?.email;
            if (email) {
                setCancelVisible(true);
                const res = await fetch(`api/user/${email}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                return res.json();
            }
            return null;
        }

        if (session) {
            getUser().then(userData => {
                if (userData?.characterID) {
                    setSelectedCharacter(userData.characterID);
                }
                else {
                    setCancelVisible(false);
                }
                
            }).catch(err => {
                console.log('err: ', err);
            });
        }
    }, [session]);

    const handleCharacterClick = (character) => {
        setSelectedCharacter(character.characterID);
    }

    const saveCharacter = async () => { 
        if (!selectedCharacter) {
            setErrorMessage('Please select a character');
            return;
        }
        const email = session?.user?.email;
        const res = await axios.post('/api/characterSelection', { characterID: selectedCharacter, email });
        router.replace("/home");
    }

    const cancelCharacter = () => {
        router.replace("/home");
    }

    return (
        <div>
            <div className="text-white text-center text-xl">Select Your Character</div>
            <div className="grid xl:grid-cols-2 sm:grid-cols-4 gap-4 mr-2 ml-2 grid-cols-1">
                {characters.map((character, index) => {

                    const isSelected = selectedCharacter === character.characterID;

                    return (
                        <div key={index} className={`text-white text-center flex flex-col items-center justify-center rounded-xl`}>
                            <input type="radio" id={character.characterName} name="character" value={character.characterID} checked={isSelected} onChange={() => {}} style={{ display: 'none'}} />
                            {/* Good characters for desktop */}
                            <div className="hidden sm:block sm:flex-col">
                                <div className="flex justify-center items-center">
                                    <Image 
                                        width={300} 
                                        height={300} 
                                        src={character.characterPicture} 
                                        alt={character.characterName} 
                                        className={`rounded-xl text-center cursor-pointer ${isSelected ? 'border-4 border-blue-500' : ''}`} 
                                        onClick={() => handleCharacterClick(character)}
                                    />
                                </div>
                                <label htmlFor={character.name} className={`${isSelected ? 'font-bold md:text-sm' : ''}`}>{character.characterName}</label>
                            </div>

                            {/* Characters for mobile */}
                            <div className="sm:hidden justify-center items-center flex">
                                <Image 
                                    width={125} 
                                    height={125} 
                                    src={character.characterPicture} 
                                    alt={character.characterName} 
                                    className={`rounded-xl text-center cursor-pointer ${isSelected ? 'border-4 border-blue-500' : ''}`} 
                                    onClick={() => handleCharacterClick(character)}
                                />
                                <label htmlFor={character.name} className={`block text-center ml-2 ${isSelected ? 'font-bold md:text-sm' : ''}`} style={{maxWidth: '300px'}}>{character.characterName}</label>
                            </div>
                        </div>
                    )
                })}
            </div>
            <div className="flex justify-center flex-col items-center">
                <div className="fixed bottom-0 mb-6">
                    <button className="border-2 border-white p-1 rounded-lg text-white" onClick={saveCharacter}>Save</button>
                    {cancelVisible && <button className="border-2 border-white p-1 rounded-lg text-white ml-2" onClick={cancelCharacter}>Cancel</button>}
                </div>
                {errorMessage && <div className="bg-red-600 text-white w-fit text-sm py-1 px-3 rounded-md mt-2 font-bold">{errorMessage}</div>}
            </div>
        </div>
    )
}