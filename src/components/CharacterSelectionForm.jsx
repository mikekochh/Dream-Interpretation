"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function CharacterSelectionForm() {

    useEffect(() => {
        async function getCharacters() {
            const res = await axios.get('/api/characters');
            console.log('res: ', res);
        }
        getCharacters();
    });

    return (
        <div className="text-white">Character Selection Form</div>
    )
}