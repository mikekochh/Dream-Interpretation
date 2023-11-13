"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { signOut } from "next-auth/react";
import { useSession } from 'next-auth/react';
import { useRouter } from "next/navigation";
import 'reactjs-popup/dist/index.css';
import Popup from 'reactjs-popup';

export default function HomePage() {

    const [dreamCredits, setDreamCredits] = useState(0);
    const [gptInterpretation, setGptInterpretation] = useState('');
    const [character, setCharacter] = useState('');

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
        async function getDreamCredits() {
            const email = session?.user?.email;
            if (email) {
                const res = await fetch(`api/userCredits/${email}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                return res.json();
            }
            return 0;
        }

        setDreamCredits(getDreamCredits());
    }, [session]);

    async function redeemCredits () {
        console.log("redeemCredits");
        const email = session?.user?.email;
        const res = await axios.post(`/api/userCredits/${email}`);
        console.log('res: ', res);
    }

    async function submitDream() {  
        const dream = document.querySelector('.DreamBox').value;
        const res = await axios.get('/api/dreamLookup', 
            { 
                params: { 
                    dream, 
                    email: session?.user?.email,
                    dreamCredits: dreamCredits.value,
                    prompt: character.prompt
                } 
            });
        console.log('res: ', res);
        setGptInterpretation(res.data[0].message.content);
        setDreamCredits(dreamCredits.value - 1 );
    }

    function characterSelection() {
        router.replace("/characterSelection");
    }

    console.log('dreamCredits: ', dreamCredits.value);

    return (
        <div className='text-white'>
        <button className="rounded-xl bg-blue-600 p-2 m-2" onClick={characterSelection}>Character Selection</button>
            <h1 className=" text-3xl text-center">The Dream Interpreter</h1>
            <h2 className="text-center">Welcome back {session?.user?.name}</h2>
            { dreamCredits.value === 0 ? 
            
            <div className="flex justify-center flex-col items-center text-center">
                <div className="text-center text-3xl">
                    Thank you for using The Dream Oracle! You've reached your limit of free dream interpretations. <br />
                    If you would like to continue to explore the meaning of your dreams, please purchase more dream credits below
                </div>
                <Popup 
                    trigger={<button  className="bg-blue-500 p-2 m-2 rounded-xl">More Credits</button>} 
                    position="bottom center"
                    contentStyle={{width: "50%"}}
                >
                    <div className="text-center text-3xl">
                        Gotcha! This was a test to see your interest in purchasing more dream credits! 
                        Happy to see you are enjoying the application and I appreciate you being an early adopter of the Dream Oracle.
                        For being couragous enough to be an early user, here is an additional 3 dream credits for free for you to keep using the application during our testing period.
                        Please leave us feedback if you see any bugs or have any suggestions, and keep on dreaming! <br />
                    </div>
                    <div className="text-center text-3xl">
                        <button className="bg-blue-500 p-2 m-2 rounded-xl text-white" onClick={redeemCredits}>Claim Credits</button>
                    </div>
                </Popup>
            </div> : 
            <div>
                <div className="flex justify-center">Enter Dream description below</div>
                <div className="flex justify-center">
                    <textarea type="text" rows={5} className="DreamBox border-2 border-black rounded-lg text-black w-2/3" />
                    <button className="border-2 border-white p-1 rounded-lg text-white" onClick={submitDream}>Submit</button>
                </div>
                <div className="justify-center flex">{character.characterName}</div>
                { gptInterpretation ? <ChatGPTResponse gptInterpretation={gptInterpretation} /> : null}
            </div>
            }
            <div className="absolute right-0 top-0">Dream Tokens: {dreamCredits}</div>
            <div className="logout absolute bottom-0 right-0 p-4">
                    <button onClick={() => signOut()} className="text-sm mt-3 text-right bg-red-700 p-2 rounded-lg">Log Out</button>
            </div>
        </div>
    );
}

const ChatGPTResponse = ({ gptInterpretation }) => {

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
        <div className="text-center m-10 DreamCard rounded-xl p-4">
            <div className="flex justify-center text-4xl">The Dream Genie Says...</div><br />
            <div className="flex justify-center w-3/4 mx-auto">
                {insertLineBreaks(gptInterpretation)}
            </div>
        </div>
    )
}