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
    const [disableSubmit, setDisableSubmit] = useState(false);
    const [loadingDream, setLoadingDream] = useState(false);
    const [savingDream, setSavingDream] = useState(false);
    const [interpretingDream, setInterpretingDream] = useState(false);

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

    async function journalDream() {
        const userID = user._id;
        var checkbox = document.getElementById('interpretCheckbox');
        const interpretDream = checkbox.checked;
        var dream = document.querySelector('.DreamBox').value;
        if (checkbox.checked) {
            console.log("Checkbox is checked.");
        } else {
            console.log("Checkbox is not checked.");
        }
        try {
            const resJournal = await axios.post('/api/dream/journal', { userID, dream, interpretDream });
            if (interpretDream) {
                const dreamID = resJournal.data._id;
                const characterID = user.characterID;
                const resInterpret = await axios.post('/api/dream/interpret', { dreamID, dream, characterID, user });
            }
        }
        catch (error) {
            setError("Error Journaling Dream");
        }   
    }

    return (
        <div className="text-white main-content">
            <button className="rounded-xl bg-blue-600 p-2 m-2" onClick={journalDream}>Journal Dream</button>
            <div>
                Interpret Dream<input type="checkbox" id="interpretCheckbox"></input>
            </div>
            <div>
                <HowItWorksPopup />
                <div className="flex justify-center">
                    <textarea type="text" rows={15} className="DreamBox border-2 border-black rounded-lg text-black w-3/4" />
                </div>
                {savingDream ? (
                    <div className="flex justify-center">
                        <div className="loader"></div>
                        Dream Being Saved...
                    </div>
                    ) : null
                }
                {interpretingDream ? (
                    <div className="flex justify-center">
                        <div className="loader"></div>
                        Dream Being Interpreted... (est. 1-2 minutes)
                    </div>
                    ) : null
                }
            </div>
            {/* <button className="rounded-xl bg-red-600 p-2 m-2" onClick={returnMainMenu}>Main Menu</button> */}
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