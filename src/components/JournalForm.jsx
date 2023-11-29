"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { signOut } from "next-auth/react";
import { useSession } from 'next-auth/react';
import { useRouter } from "next/navigation";
import 'reactjs-popup/dist/index.css';
import Popup from 'reactjs-popup';
import ContactAndPrivacyButtons from "./ContactAndPrivacyButtons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

export default function JournalForm() { 

    const { data: session } = useSession();
    const [user, setUser] = useState(null);
    const [error, setError] = useState(false);

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
        const dream = "testing adding dream";
        var checkbox = document.getElementById('interpretCheckbox');
        const interpretDream = checkbox.checked;
        if (checkbox.checked) {
            console.log("Checkbox is checked.");
        } else {
            console.log("Checkbox is not checked.");
        }
        try {
            const resJournal = await axios.post('/api/dream/journal', { userID, dream });
            if (interpretDream) {
                const dreamID = resJournal.data._id;
                const characterID = user.characterID;
                const resInterpret = await axios.post('/api/dream/interpret', { dreamID, characterID });
            }
        }
        catch (error) {
            setError("Error Journaling Dream");
        }   
    }

    return (
        <div className="text-white">
            <button className="rounded-xl bg-blue-600 p-2 m-2" onClick={journalDream}>Journal Dream</button>
            <div>
                Interpret Dream<input type="checkbox" id="interpretCheckbox"></input>
            </div>
        </div>

    )
}