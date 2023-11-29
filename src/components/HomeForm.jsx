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

export default function HomePage() {

    const [gptInterpretation, setGptInterpretation] = useState('');
    const [character, setCharacter] = useState('');
    const [user, setUser] = useState('');
    const [disableSubmit, setDisableSubmit] = useState(false);
    const [loadingDream, setLoadingDream] = useState(false);
    const [userDream, setUserDream] = useState('');
    const [error, setError] = useState(false);

    const { data: session } = useSession();

    const router = useRouter();

    useEffect(() => {
        async function setCharacterData() {
            const res = await axios.get(`api/characterSelection`, { params: { email: session?.user?.email } });
            setCharacter(res.data);
        }

        if (session) {
            setCharacterData();
        }
    }, [session]);

    useEffect(() => {
        async function getUser() {
            const email = session?.user?.email;
            if (email) {
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
                setUser(userData);
            }).catch(err => {
                console.log('err: ', err);
            });
        }
    }, [session]);

    function newDream() {
        setGptInterpretation('');
        window.location.reload();
    }

    async function redeemCredits () {
        const email = session?.user?.email;
        const res = await axios.post(`/api/userCredits/${email}`, { action: 'redeemCredits' });
        window.location.reload();
    }

    async function submitDream() {  
        setLoadingDream(true);
        setDisableSubmit(true);
        const dream = document.querySelector('.DreamBox').value;
        setUserDream(dream);
        const res = await axios.get('https://us-central1-dream-oracles.cloudfunctions.net/dreamLookup',
            {
                params: {
                    dream,
                    prompt: character.prompt
                }
            });
        
        if (res.status !== 200) {
            setError(true);
            setLoadingDream(false);
            return;
        }
        const resCredits = await axios.post(`api/userCredits/${session?.user?.email}`, { action: 'decrementCredit' });
        setGptInterpretation(res.data[0].message.content);
        setDisableSubmit(false);
        setLoadingDream(false);
    }

    function characterSelection() {
        router.replace("/characterSelection");
    }

    return (
        <div className='text-white'>
            <h1 className=" text-3xl text-center">The Dream Oracles</h1>
            <h2 className="text-center">Welcome back {user.name}</h2>
            <ContactAndPrivacyButtons />
        </div>
    );
}