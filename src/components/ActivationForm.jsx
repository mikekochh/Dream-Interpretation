"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';

export default function ActivationForm() { 

    const searchParams = useSearchParams();
    const activationTokenID = searchParams.get('activationTokenID');
    const router = useRouter();

    const activateUser = async function() {
        try {
            const res = await axios.post('api/activate', { activationTokenID });
            console.log('res: ', res);
            router.push('/userLogin');
        } catch (error) {
            console.log('error: ', error);
        }
    }
    

    useEffect(() => {
        activateUser();
    }, []);

    return (
        <div className="text-white text-3xl text-center">
            Successfully Activated!
        </div>
    )
}