"use client";

import React, { useState, useEffect } from 'react';
import OpenAI from 'openai';
import axios from 'axios';
import Link from 'next/link';
import { signOut } from "next-auth/react";
import { useSession } from 'next-auth/react';

export default function HomePage() {

    const [dreamCredits, setDreamCredits] = useState(10);

    // useEffect(() => {
    //     async function getDreamCredits() {
    //         const res = await axios.get('/api/userCredits');
    //         console.log('res.data: ', res.data);
    //         return res.data;
    //     }
    //     setDreamCredits(getDreamCredits());
    // }, []);

    const { data: session } = useSession();

    console.log('data: ', session);

    const [gptInterpretation, setGptInterpretation] = useState('');

    async function submitDream() {  
        const dream = document.querySelector('.DreamBox').value;
        const res = await axios.get('/api/dreamLookup', { params: { dream } });
        console.log("res.data[0].message.content: ", res.data[0].message.content);
        setGptInterpretation(res.data[0].message.content);
        console.log('gptInterpretation: ', gptInterpretation);
    }

    return (
        <div className='text-white'>
            <h1 className=" text-3xl text-center">The Dream Interpreter</h1>
            <h2 className="text-center">Welcome back {session?.user?.name}</h2>
            <div className="flex justify-center">Enter Dream description below</div>
            <div className="flex justify-center">
                <textarea type="text" rows={5} className="DreamBox border-2 border-black rounded-lg text-black w-2/3" />
                <button className="border-2 border-white p-1 rounded-lg text-white" onClick={submitDream}>Submit</button>
            </div>
            {/* <div className="absolute right-0 top-0">Dream Tokens: {dreamCredits}</div> */}
            { gptInterpretation ? <ChatGPTResponse gptInterpretation={gptInterpretation} /> : null}
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
        <div>
            <div>Chat GPT Response:</div>
            <div>
                {insertLineBreaks(gptInterpretation)}
            </div>
        </div>
    )
}