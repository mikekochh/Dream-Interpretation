"use client";
import React, { useState } from 'react';
import OpenAI from 'openai';
import axios from 'axios';

export default function HomePage() {

    const [gptInterpretation, setGptInterpretation] = useState('');

    async function submitDream() {  
        const dream = document.querySelector('.DreamBox').value;
        const res = await axios.get('/api/dreamLookup', { params: { dream } });
        console.log("res.data[0].message.content: ", res.data[0].message.content);
        setGptInterpretation(res.data[0].message.content);
        console.log('gptInterpretation: ', gptInterpretation);
    }

    return (
        <div className='text-white star-background'>
            <span className="shooting-star"></span>
            <span className="shooting-star"></span>
            <span className="shooting-star"></span>
            <span className="shooting-star"></span>
            <span className="shooting-star"></span>
            <span className="shooting-star"></span>
            <span className="shooting-star"></span>
            <span className="shooting-star"></span>
            <span className="shooting-star"></span>
            <span className="shooting-star"></span>
            <h1 className="text-white text-3xl text-center">The Dream Interpreter</h1>
            <div className="flex justify-center">Enter Dream description below</div>
            <div className="flex justify-center">
                <textarea type="text" rows={5} className="DreamBox border-2 border-black rounded-lg text-black w-2/3" />
                <button className="border-2 border-white p-1 rounded-lg text-white" onClick={submitDream}>Submit</button>
            </div>
            { gptInterpretation ? <ChatGPTResponse gptInterpretation={gptInterpretation} /> : null}
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

