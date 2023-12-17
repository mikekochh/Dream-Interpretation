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
import Link from 'next/link';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

export default function DreamsForm() { 

    const { data: session } = useSession();
    const [dreams, setDreams] = useState([]);
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    useEffect(() => {

        const getDreams = async () => {
            if (session && dreams.length === 0) {
                setLoading(true);
                const res = await axios.get('api/dream/user/' + session.user.email);
                const sortedDreams = res.data.sort((a, b) => {
                    return new Date(b.dreamDate) - new Date(a.dreamDate);
                });
                setDreams(sortedDreams);
                setLoading(false);
            }
        }

        getDreams();
    }, [session]);

    const formatDreamDate = (dreamDate) => {
        const date = new Date(dreamDate);
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const year = date.getFullYear();
        return month + "/" + day + "/" + year;
    }

    const deleteDream = async (dreamID) => {
        console.log("deleteing dream: ", dreamID);
        const res = await axios.post('/api/dream/delete', { dreamID });
        if (res.status === 200) {
            const newDreams = dreams.filter(dream => dream._id !== dreamID);
            setDreams(newDreams);
        }
    }

    return (
        <div className="text-white main-content">
            <h1 className="text-5xl text-center font-bold pb-5">Dreams</h1>    
            {loading && (
                <div className="flex text-center justify-center inset-0 items-center pt-20 pb-5">
                    <p className="text-center text-3xl pr-3">Loading Dreams</p>
                    <div className="loader"></div>  
                </div>
            )}
            {session && (
                dreams.map((dream) => (
                    <div 
                        key={dream._id} 
                        className="flex flex-col items-center justify-center text-white border-white border m-2 rounded-xl cursor-pointer relative"
                    >
                        <Link href={{
                            pathname: '/dreamDetails',
                            query: { dreamID: dream._id },
                        
                        }}>
                            <div className="pl-10 pr-10 relative">
                                <p>
                                    <span className="font-bold">Dream Description: </span>{dream.dream}
                                </p>
                                <p>
                                    <span className="font-bold">Dream Date: </span>{formatDreamDate(dream.dreamDate)}
                                </p>
                                <p>
                                    <span className="font-bold">Interpretations: </span>{dream.interpretation ? 'Yes' : 'No'}
                                </p>
                            </div>
                        </Link>
                        <FontAwesomeIcon 
                                    icon={faTrash} 
                                    size="2x" 
                                    className="absolute right-0 top-0 p-2 wiggle"
                                    onClick={() => deleteDream(dream._id)}    
                        />
                    </div>
                )
            ))}
        </div>
    )
}