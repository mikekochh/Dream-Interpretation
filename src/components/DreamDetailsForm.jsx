"use client";
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function DreamsForm() { 

    const searchParams = useSearchParams();
 
    const dreamID = searchParams.get('dreamID');

    const [dreamDetails, setDreamDetails] = useState([]);
    const [oracles, setOracles] = useState([]);
    const [notes, setNotes] = useState('');
    const router = useRouter();
    const [saving, setSaving] = useState(false);

    useEffect(() => {

        const getDreamDetails = async () => {
            const res = await axios.get('api/dream/details/' + dreamID);
            setDreamDetails(res.data.dreamDetails);
        }   

        async function getOracles() {
            const res = await axios.get('/api/oracles');
            setOracles(res.data);
        }

        async function getNotes() {
            const res = await axios.get('/api/dream/note/' + dreamID);
            if (!res.data.dreamNotes.length) return;
            document.querySelector('.NoteBox').value = res.data.dreamNotes[0].note;
        }

        getOracles();
        getDreamDetails();
        getNotes();
    }, []);

    const formatInterpretationDate = (dreamDate) => {
        const date = new Date(dreamDate);
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const year = date.getFullYear();
        return month + "/" + day + "/" + year;
    }

    const getOracleName = (oracleID) => { 
        if (!oracles.length) return;
        const oracle = oracles.find(oracle => oracle.oracleID === oracleID);
        return oracle.oracleName;
    }

    const insertLineBreaks = (text) => {
        const lines = text.split('\n');
        return lines.map((line, index) => (
          <React.Fragment key={index}>
            {line}
            {index < lines.length - 1 && <br />}
          </React.Fragment>
        ));
    }

    const saveNotes = async () => {
        setSaving(true);
        const note = document.querySelector('.NoteBox').value;
        const res = await axios.post('api/dream/note/' + dreamID, { note });
        router.push('/dreams');
    }

    const backToDreams = () => {
        router.push('/dreams');
    }

    return (
        <div className="flex h-screen">
            <div className="md:w-2/3 main-content">
                {dreamDetails && oracles && (
                    dreamDetails.map((detail) => (
                        <div 
                            key={detail._id} 
                            className="flex flex-col items-center justify-center text-white border-white border m-2 rounded-xl pr-2"
                        >
                            <div className="pl-10">
                                <p>
                                    <span className="font-bold">Interpretation Date: </span>{formatInterpretationDate(detail.interpretationDate)}
                                </p>
                                <p>
                                    <span className="font-bold">Oracle: </span>{getOracleName(detail.oracleID)}
                                </p>
                                <p>
                                    <span className="font-bold">Interpretation: </span>{insertLineBreaks(detail.interpretation)}
                                </p>
                            </div>
                        </div>
                    )
                ))}
            </div>
            <div className="md:w-1/3 main-content relative">
                <div className="border border-white rounded-xl text-white m-2 p-2">
                    <p className="font-bold">Dream Notes</p>
                    <textarea type="text" rows={20} className="DreamBox NoteBox border-2 border-black rounded-lg text-black w-full h-full" />
                </div>
                <div className="relative">
                    <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded m-2" onClick={backToDreams}>Back</button>
                    {saving ? (
                        <div className="flex right-0 absolute m-2 top-0">
                            <div className="loader"></div>
                        </div>
                    ) : (
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded right-0 absolute m-2" onClick={saveNotes}>Save</button>
                    )}
                </div>
            </div>
        </div>
    )
}