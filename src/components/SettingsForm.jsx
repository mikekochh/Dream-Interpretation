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

const SettingsForm = () => {

    const router = useRouter();

    const logout = async () => {
        await signOut();
        router.push("/homePage");
    }

    return (
        <div>
            <div className="logout absolute bottom-0 left-0 p-4">
                <button onClick={logout} className="text-sm mt-3 text-right bg-red-700 p-2 rounded-lg">Log Out</button>
            </div>
        </div>
    )

}

export default SettingsForm;

