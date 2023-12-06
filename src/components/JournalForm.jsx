"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { signOut } from "next-auth/react";
import { useSession } from 'next-auth/react';
import 'reactjs-popup/dist/index.css';
import Popup from 'reactjs-popup';
import ContactAndPrivacyButtons from "./ContactAndPrivacyButtons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

export default function JournalForm() { 

    const { data: session } = useSession();
    const [user, setUser] = useState(null);
    const [error, setError] = useState(false);
    const [savingDream, setSavingDream] = useState(false);
    const [characters, setCharacters] = useState([]);

    useEffect(() => {
        async function setUserData() {
            const email = session?.user?.email;
            const res = await fetch(`api/user/${email}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            return res.json();
        }

        if (session) {
            setUserData().then(userData => {
                setUser(userData);
            }).catch(err => {
                console.log('err: ', err);
            });
        }
    }, [session]);


    useEffect(() => {
        async function getCharacters() {
            const res = await axios.get('/api/characters');
            setCharacters(res.data);
        }

        getCharacters();
    }, []);

    async function journalDream() {
        var dream = document.querySelector('.DreamBox').value;
        if (!dream) {
            setError("Please enter a dream");
            return;
        }
        setSavingDream(true);
        const userID = user._id;
        let interpretDream = false;
        characters.forEach(character => {
            var checkbox = document.getElementById(character.characterID);
            if (checkbox.checked) {
                interpretDream = true;
            }
        });
        try {
            const resJournal = await axios.post('/api/dream/journal', { userID, dream, interpretDream });
            if (interpretDream) {
                const dreamID = resJournal.data._id;
                const short = document.getElementById('short').checked;
                console.log("short", short);
                for (let character of characters) {
                    var checkbox = document.getElementById(character.characterID);
                    if (checkbox.checked) {
                        const resInterpret = await axios.post('/api/dream/interpret', 
                            { 
                                dreamID, 
                                dream, 
                                characterID: character.characterID, 
                                user,
                                short
                            });
                    }
                }
            }
        }
        catch (error) {
            setError("Error Journaling Dream");
        }   
    }

    const resetPage = () => {
        console.log("resetPage");
        setSavingDream(false);
        setError('');
    }

    return (
        <div className="text-white main-content relative">
            {savingDream ? (
                <div className="flex justify-center flex-col">
                    <p className="text-center text-2xl">
                        You're dream has been saved and is currently being interpreted. Please wait up to 1-2 minutes for your
                        interpretations to appear under the dream details.
                    </p>
                    <div className="flex justify-center">
                        <button className="rounded-xl bg-blue-600 p-2 m-2 pl-4 pr-4 justify-center item" onClick={resetPage}>OK</button>
                    </div>  
                </div>
            ) : (
                <div>
                    <button className="rounded-xl bg-blue-600 p-2 m-2" onClick={journalDream}>Journal Dream</button>
                    <div>
                        <HowItWorksPopup />
                        <div className="flex flex-col">
                            <div className="flex justify-center">
                                <textarea type="text" rows={15} className="DreamBox border-2 border-black rounded-lg text-black w-3/4" />
                            </div>
                        </div>
                        <div>
                            {error && (
                                <div className="bg-red-500 w-max p-1 rounded-xl">{error}</div>
                            )}  
                        </div>
                        <CharacterSelectionPopup />
                        <div className="justify-center flex">
                            {characters.map((character) => (
                                <div key={character._id} className="flex justify-center p-5">
                                    <input type="checkbox" id={character.characterID} name={character.characterID} value={character.characterID}></input>
                                    <label htmlFor={character.characterID}>{character.characterName}</label>
                                </div>
                            ))}
                        </div>
                        <ResponseTypePopup />
                        <div className="justify-center flex">
                            <div className="flex justify-center p-5">
                                <input type="checkbox" id="short" name="short" value="short"></input>
                                <label htmlFor="short">Short</label>
                            </div>
                        </div>
                        <button className="rounded-xl bg-blue-600 p-2 m-2 absolute right-0" onClick={journalDream}>Journal Dream</button><br />
                    </div>
                    {/* <button className="rounded-xl bg-red-600 p-2 m-2" onClick={returnMainMenu}>Main Menu</button> */}
                </div>
            )}
        </div>

    )
}

const HowItWorksPopup = () => {

    return (
        <div className="flex justify-center text-3xl pb-5">
            Enter Dream Description Below
            <Popup 
                trigger={<button><FontAwesomeIcon icon={faInfoCircle} className="ml-2"/></button>} 
                position="bottom center"
                contentStyle={{width: "50%"}}
            >
                <b>How do I write a good prompt?</b><br/>
                Describe your dream in as much detail as you can. The more detail you provide, the more accurate the interpretation will be.
                If you can, also try and describe how you felt during the dream. Were you scared? Happy? Sad? Angry? 
                Who was in your dream? Don&apos;t use names, describe their relationship to you. Was it a friend? A family member? A stranger?
                <br/><br/>
                <b>I have a theory about what my dream means</b><br/>
                Great! Please include this in the prompt. If you have no idea what the dream means, that is fine it will still work fine.
                But, if you think it is relating to something in real life, include this in the dream. Our dreams are inspired by real life,
                and it is important to paint the full picture as much as possible. 
            </Popup>
        </div>
    )
}

const CharacterSelectionPopup = () => {

    return (
        <div className="flex justify-center text-3xl pt-5">
            Select Characters to Interpret Your Dreams
            <Popup 
                trigger={<button><FontAwesomeIcon icon={faInfoCircle} className="ml-2"/></button>} 
                position="top center"
                contentStyle={{width: "50%"}}
            >
                <b>Selecting characters</b><br/>
                Here, you can select which characters you would like to interpret your dream. You can select as
                many as you'd like, or none at all. There interpretations will appear under the dream details page.
                Please allow 1-2 minutes for the interpretations to appear under the dream details page.
            </Popup>
        </div>
    )
}

const ResponseTypePopup = () => {

    return (
        <div className="flex justify-center text-3xl pt-5">
            Select Response Type
            <Popup 
                trigger={<button><FontAwesomeIcon icon={faInfoCircle} className="ml-2"/></button>} 
                position="top center"
                contentStyle={{width: "50%"}}
            >
                <b>Response Type</b><br/>
                If you would like a shorter answer, or the ability to ask a followup question, select short.
                Otherwise, you can leave it blank and the dream oracle will provide a full interpretation.
            </Popup>
        </div>
    )
}