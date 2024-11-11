"use client";
import React from 'react';
import RegisterForm from '../RegisterForm';

const RegisterBeforeInterpretation = ({ isMobile }) => {

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