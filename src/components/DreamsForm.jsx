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

export default function DreamsForm() { 

    const { data: session } = useSession();
    const [dreams, setDreams] = useState([]);
    const router = useRouter();

    useEffect(() => {

        const getDreams = async () => {
            if (session && dreams.length === 0) {
                console.log("session", session);
                const res = await axios.get('api/dream/user/' + session.user.email);
                console.log("res", res);
                setDreams(res.data);
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

    return (
        <div className="text-white main-content">
            <h1 className="text-3xl text-center">Dreams</h1>    
            {session && (
                dreams.map((dream) => (
                    <div 
                        key={dream._id} 
                        className="flex flex-col items-center justify-center text-white border-white border m-2 rounded-xl cursor-pointer"
                    >
                        <Link href={{
                            pathname: '/dreamDetails',
                            query: { dreamID: dream._id },
                        
                        }}>
                            <div className="pl-10">
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
                    </div>
                )
            ))}
        </div>
    )
}