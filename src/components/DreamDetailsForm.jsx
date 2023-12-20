"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function DreamsForm() { 

    const searchParams = useSearchParams();
 
    const dreamID = searchParams.get('dreamID');

    const textAreaRef = useRef(null);

    const [dreamDetails, setDreamDetails] = useState([]);
    const [oracles, setOracles] = useState([]);
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [loadingInterpretations, setLoadingInterpretations] = useState(false);
    const [loadingNotes, setLoadingNotes] = useState(false);

    useEffect(() => {

        const getDreamDetails = async () => {
            setLoadingInterpretations(true);
            setLoadingNotes(true);
            const res = await axios.get('api/dream/details/' + dreamID);
            setDreamDetails(res.data.dreamDetails);
            const resOracles = await axios.get('/api/oracles');
            setOracles(resOracles.data);
            setLoadingInterpretations(false);
            const resNotes = await axios.get('/api/dream/note/' + dreamID);
            if (!resNotes.data.dreamNotes.length) {
                // textAreaRef.current.classList.remove('hidden');
                setLoadingNotes(false);
                return;
            } 
            document.querySelector('.NoteBox').value = resNotes.data.dreamNotes[0].note;
            // textAreaRef.current.classList.remove('hidden');
            setLoadingNotes(false);
        }

        getDreamDetails();
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
        <div className="flex flex-col main-content h-screen text-white">
            <h1 className="text-5xl text-center font-bold pb-5">Dream Details</h1>
            <div className="flex md:flex-row flex-col relative">
                <div className="md:w-2/3 text-white border-white border rounded-xl">
                    <h1 className="text-3xl text-center font-bold pb-5">Interpretations</h1>
                    {loadingInterpretations && (
                        <div className="flex text-center justify-center inset-0 items-center pt-20 pb-5">
                            <p className="text-center text-3xl pr-3">Loading Interpretations</p>
                            <div className="loader"></div>  
                        </div>
                    )}
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
                <div className="md:w-1/3">
                    <div className="border border-white rounded-xl text-white  p-2">
                        <h1 className="text-3xl text-center font-bold pb-5">Dream Notes</h1>
                        {loadingNotes && (
                            <div className="flex text-center justify-center inset-0 items-center pt-20 pb-5">
                                <p className="text-center text-3xl pr-3">Loading Notes</p>
                                <div className="loader"></div>  
                            </div>
                        )}
                        <textarea 
                            type="text" 
                            rows={20}
                            className="DreamBox NoteBox border-2 border-black rounded-lg text-black w-full h-full p-2"
                            style={{ minHeight: '100px' }}
                        />
                    </div>
                    <div className="flex justify-end items-end md:relative">
                        <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded m-2 back-button" onClick={backToDreams}>Back</button>
                        {saving ? (
                            <div className="flex right-0 absolute m-2 top-0">
                                <div className="loader"></div>
                            </div>
                        ) : (
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded right-0 justify-end m-2 bottom-0 dream-button" onClick={saveNotes}>Save</button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}