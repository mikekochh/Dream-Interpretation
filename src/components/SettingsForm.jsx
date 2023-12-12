"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

const SettingsForm = () => {

    const router = useRouter();

    const logout = async () => {
        await signOut({ redirect: false });
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

