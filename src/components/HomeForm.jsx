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
        const res = await axios.post(`/api/userCredits/${email}`);
        window.location.reload();
    }

    async function submitDream() {  
        setLoadingDream(true);
        setDisableSubmit(true);
        const dream = document.querySelector('.DreamBox').value;
        setUserDream(dream);
        // const res = await axios.get('/api/dreamLookup', 
        //     { 
        //         params: { 
        //             dream, 
        //             email: session?.user?.email,
        //             dreamCredits: user.credits,
        //             prompt: character.prompt
        //         } 
        //     });
        const res = await axios.get('https://us-central1-dream-oracles.cloudfunctions.net/dreamLookup',
            {
                params: {
                    dream,
                    email: session?.user?.email,
                    dreamCredits: user.credits,
                    prompt: character.prompt
                }
            });
        setGptInterpretation(res.data[0].message.content);
        setDisableSubmit(false);
        setLoadingDream(false);
    }

    function characterSelection() {
        router.replace("/characterSelection");
    }

    return (
        <div className='text-white'>
        <button className="rounded-xl bg-blue-600 p-2 m-2" onClick={characterSelection}>Character Selection</button>
            <h1 className=" text-3xl text-center">The Dream Oracles</h1>
            <h2 className="text-center">Welcome back {user.name}</h2>
            { user.credits === 0 ? 
            (
                <div className="flex justify-center flex-col items-center text-center">
                    <div className="text-center text-3xl">
                        Thank you for using The Dream Oracle! You&apos;ve reached your limit of free dream interpretations. <br />
                        If you would like to continue to explore the meaning of your dreams, please purchase more dream credits below
                    </div>
                    <Popup 
                        trigger={<button  className="bg-blue-500 p-2 m-2 rounded-xl">Buy More Credits</button>} 
                        position="bottom center"
                        contentStyle={{width: "50%"}}
                    >

                        { !user.redeemedCredits ?                     
                        <div>
                            <div className="text-center text-3xl">
                                Gotcha! This was a test to see your interest in purchasing more dream credits! 
                                Happy to see you are enjoying the application and I appreciate you being an early adopter of the Dream Oracle.
                                For being couragous enough to be an early user, here is an additional 3 dream credits for free for you to keep using the application during our testing period.
                                Please leave us feedback if you see any bugs or have any suggestions, and keep on dreaming! <br />
                            </div>
                            <div className="text-center text-3xl">
                                <button className="bg-blue-500 p-2 m-2 rounded-xl text-white" onClick={redeemCredits}>Claim Credits</button>
                            </div>
                        </div>
                        : 
                        <div>
                        <div className="text-center text-3xl">
                                Hello again! I know you are eager to continue using The Dream Oracle, but unfortunately we are still in testing phase and buying credits is unavailable.
                                We appreciate you using our application so much, and when credits become more available (among other additional features), we would love to have you back!
                                Thanks for using The Dream Oracle, keep on dreaming! <br />
                            </div>
                        </div>
                        }
                    </Popup>
                </div>
            ) : !gptInterpretation ? (
                <div>
                    <div className="flex justify-center">
                        Enter Dream description below
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
                    <div className="flex justify-center">
                        <textarea type="text" rows={5} className="DreamBox border-2 border-black rounded-lg text-black w-2/3" />
                        { !disableSubmit && <button className="border-2 border-white p-1 rounded-lg text-white" onClick={submitDream}>Submit</button>}
                    </div>
                    <div className="justify-center flex">{character.characterName}</div>
                    {loadingDream ? (
                        <div className="flex justify-center">
                            <div className="loader"></div>
                            Dream Being Interpreted...
                        </div>
                        ) : null
                    }
                </div>
            ) : (
                <div>
                    { gptInterpretation ? 
                        <ChatGPTResponse 
                            gptInterpretation={gptInterpretation} 
                            characterNameShort={character.characterNameShort} 
                            newDream={newDream}
                            userDream={userDream}
                        /> 
                    : null}
                </div>
            )}
            <div className="absolute right-0 top-0 p-2">Dream Tokens: {user.credits}</div>
            <div className="logout absolute bottom-0 left-0 p-4">
                    <button onClick={() => signOut()} className="text-sm mt-3 text-right bg-red-700 p-2 rounded-lg">Log Out</button>
            </div>
            { gptInterpretation && (
                <div className="absolute bottom-0 right-0 p-4">
                    <button className="rounded-lg bg-blue-600 text-sm mt-3 p-2" onClick={newDream}>New Dream</button>
                </div>
            )}
            <ContactAndPrivacyButtons />
        </div>
    );
}

const ChatGPTResponse = ({ gptInterpretation, characterNameShort, newDream, userDream }) => {

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
            <div className="text-center m-10 DreamCard rounded-xl p-4 relative">
                <div className="flex justify-center text-4xl">You&apos;re original dream:</div><br />
                <div className="flex justify-center sm:w-3/4 mx-auto">
                    {insertLineBreaks(userDream)}
                </div>
                <div className="flex justify-center text-4xl">{characterNameShort} Says...</div><br />
                <div className="flex justify-center sm:w-3/4 mx-auto">
                    {insertLineBreaks(gptInterpretation)}
                </div>
            </div>
        </div>
    )
}