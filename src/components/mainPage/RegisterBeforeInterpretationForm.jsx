"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PAGE_INTERPRET_CREATE_ACCOUNT } from '@/types/pageTypes';
import RegisterForm from '../RegisterForm';

const RegisterBeforeInterpretation = ({ isMobile }) => {

    const [countedView, setCountedView] = useState(false);

    useEffect(() => {
        const addView = async () => {
            const referrer = document.referrer;
            const isFromInstagram = referrer.includes('instagram.com');

            if (window.location.hostname !== 'localhost') {
                await axios.post('/api/views/addView', {
                    pageID: PAGE_INTERPRET_CREATE_ACCOUNT,
                    isFromInstagram
                });
                setCountedView(true);
            }
        }

        if (!countedView) {
            addView();
        }
    }, []);

    return (
        <div className="text-center">
            <p className={`gradient-title-text ${isMobile ? 'golden-ratio-3' : 'golden-ratio-4'}`}>Create an Account</p>
            <p className="golden-ratio-2">Create an account with us to view your dream interpretation</p>
            <div className="text-center flex justify-center">
                <RegisterForm />
            </div>
        </div>
    )
}

export default RegisterBeforeInterpretation;