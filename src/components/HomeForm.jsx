"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { signOut } from "next-auth/react";
import { useSession } from 'next-auth/react';
import { useRouter } from "next/navigation";

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

    return (
        <div className='text-white'>
        <button className="rounded-xl bg-blue-600 p-2 m-2" onClick={characterSelection}>Character Selection</button>
            <h1 className=" text-3xl text-center">The Dream Interpreter</h1>
            <h2 className="text-center">Welcome back {session?.user?.name}</h2>
            <div className="flex justify-center">Enter Dream description below</div>
            <div className="flex justify-center">
                <textarea type="text" rows={5} className="DreamBox border-2 border-black rounded-lg text-black w-2/3" />
                <button className="border-2 border-white p-1 rounded-lg text-white" onClick={submitDream}>Submit</button>
            </div>
            <div className="absolute right-0 top-0">Dream Tokens: {dreamCredits}</div>
            <div className="justify-center flex">{character.characterName}</div>
            { gptInterpretation ? <ChatGPTResponse gptInterpretation={gptInterpretation} /> : null}
            {/* { true ? <ChatGPTResponse gptInterpretation={gptInterpretation} /> : null} */}
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
                {/* Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ac justo vitae urna tincidunt ullamcorper. Proin euismod arcu vel justo commodo, ac convallis libero fermentum. Quisque ac neque a ligula eleifend vestibulum. Integer bibendum sem id elit pulvinar, sit amet fringilla enim vestibulum. Mauris ut mauris quis libero feugiat fringilla. Fusce ultricies ipsum eu risus cursus, nec malesuada justo lacinia. Aliquam erat volutpat. Nunc sit amet sapien nec metus lobortis tincidunt. Ut bibendum tellus ac justo dapibus, vel commodo nulla bibendum. Suspendisse potenti.

Praesent vel neque nec velit hendrerit consequat. Aenean euismod, elit vitae interdum volutpat, libero justo accumsan justo, sit amet bibendum turpis tortor vel tortor. Integer sed tincidunt turpis. Fusce dapibus massa a augue faucibus, vel vulputate dolor vestibulum. Vivamus nec risus vitae mauris eleifend congue vel in elit. Sed in ultricies nulla. Integer aliquam, sapien sit amet tristique tristique, neque elit ullamcorper odio, at gravida lectus dolor vel quam. Quisque bibendum congue augue, ac fringilla mauris eleifend sit amet. Donec aliquet hendrerit justo, id consequat lacus sodales vel.

Nulla facilisi. Suspendisse potenti. Fusce at enim id quam ultricies tempus nec vel tortor. Maecenas commodo dapibus massa, a consequat odio commodo eu. In hac habitasse platea dictumst. Sed aliquet turpis vel efficitur eleifend. Morbi ultricies odio at diam ultricies, nec varius tortor laoreet. Phasellus vel justo vel libero malesuada ullamcorper. Suspendisse fermentum in orci ut cursus.

Curabitur vel nunc vel arcu consequat feugiat. Integer ac convallis nunc, in scelerisque lacus. Etiam sodales elit in mauris consectetur, vel tincidunt justo elementum. Sed non augue ut purus suscipit malesuada. Quisque vitae justo vitae arcu posuere convallis. Vivamus eget augue vel justo ultrices feugiat. Sed nec consequat ipsum, nec scelerisque ligula. Proin sit amet purus eget ex tristique tempus. Ut a turpis vel lectus bibendum cursus. */}

            </div>
        </div>
    )
}