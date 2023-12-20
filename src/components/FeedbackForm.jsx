"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import axios from 'axios';

export default function FeedbackForm() {

    const { data: session } = useSession();
    const router = useRouter();
    const [feedbackSuccessful, setFeedbackSuccessful] = useState(false);

    const submitFeedback = async function() {
        var feedback = document.querySelector('.DreamBox').value;
        var userEmail = session.user.email;
        const res = await axios.post('/api/feedback', { feedback, userEmail });
        setFeedbackSuccessful(true);
    }

    return (
        <div className="text-white text-3xl text-center p-4 main-content">
        {!feedbackSuccessful ? (
            <div>
                <p className="p-2">Drop your feedback below! Thank you for taking the time to give feedback</p>
                <textarea className="DreamBox w-full rounded-xl p-2" rows={10} placeholder="Feedback"></textarea>
                <button className="dream-button" onClick={submitFeedback}>Submit</button>
            </div>
        ) : (
            <div className="flex flex-col middle-content">
                <p className="p-2">Thank you for your feedback!</p>
                <button className="dream-button" onClick={() => router.push('/journal')}>Home</button>
            </div>
        )}

        </div>
    )
}