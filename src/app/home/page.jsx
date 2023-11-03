"use client";
import React, { useState } from 'react';
import OpenAI from 'openai';
import axios from 'axios';

export default function HomePage() {

    const [gptInterpretation, setGptInterpretation] = useState('');

    async function submitDream() {  
        const dream = document.querySelector('.DreamBox').value;
        const res = await axios.get('/api/dreamLookup', { params: { dream } });
        setGptInterpretation(res.data[0].message.content);
        console.log('gptInterpretation: ', gptInterpretation);
    }

    return (
        <div className='text-white'>
            <h1 className="text-white text-3xl text-center">The Dream Interpreter</h1>
            <div className="flex justify-center">Enter Dream description below</div>
            <div className="flex justify-center">
                <input type="text" className="DreamBox border-2 border-black rounded-lg text-black" />
                <button className="border-2 border-white p-1 rounded-lg text-white" onClick={submitDream}>Submit</button>
            </div>
            <div>
                GPT Answer: {gptInterpretation}
            </div>
        </div>
    );
}

