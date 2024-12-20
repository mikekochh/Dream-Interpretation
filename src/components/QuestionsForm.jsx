"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function QuestionsForm() {
    const searchParams = useSearchParams();
    const dreamID = searchParams.get('dreamID');
    const router = useRouter();
    
    const [errorMessage, setErrorMessage] = useState('');


    console.log('dreamID: ', dreamID);

    // now we need to fetch the original interpretation for this dream

    useEffect(() => {
        const fetchOriginalInterpretation = async () => {
            try {
                const response = await axios.get('/api/dream/getOriginalInterpretation/' + dreamID);

                console.log("response: ", response);
            } catch (error) {
                console.log("There was an error fetching the original interpretation");
            }
        }

        if (dreamID) {
            fetchOriginalInterpretation();
        }
        else {
            setErrorMessage('Invalid Dream. Please try again');
        }
    }, [])

    if (errorMessage) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <p className="text-red-500 text-2xl mb-4">{errorMessage}</p>
                <div className="flex space-x-4">
                    <button className="start-button" onClick={() => router.push('/')}>Return home</button>
                    <button className="secondary-button" onClick={() => router.push('/feedback')}>Report Issue</button>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen mx-auto w-2/3 text-center">
            <h2 className="gradient-title-text golden-ratio-4">Resonation</h2>
            <p className="text-white golden-ratio-2">Select any parts of your past dream you resonated with, found truth in, or found helpful</p>
        </div>
    )
}