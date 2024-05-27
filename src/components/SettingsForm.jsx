"use client";
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import ContactAndPrivacyButtons from './ContactAndPrivacyButtons';
import axios from 'axios';

const SettingsForm = () => {
    const router = useRouter();
    const { data: session } = useSession();
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true);
    const [selectedGenderID, setSelectedGenderID] = useState('');

    // New state variables for the form
    const [genders, setGenders] = useState([]);
    const [culturalBackground, setCulturalBackground] = useState('');
    const [spiritualPractices, setSpiritualPractices] = useState('');
    const [age, setAge] = useState('');
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        async function setUserData() {
            const email = session?.user?.email;
            const res = await fetch(`api/user/${email}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            return res.json();
        }

        if (session) {
            setUserData().then(userData => {
                setUser(userData);
                setSelectedGenderID(userData.genderID || '');
                setCulturalBackground(userData.culturalBackground || '');
                setSpiritualPractices(userData.spiritualPractices || '');
                setAge(userData.age || '');
                setLoading(false);
            }).catch(err => {
                console.log('err: ', err);
                setLoading(false);
            });
        } else {
            setLoading(false);
        }
    }, [session]);

    useEffect(() => {
        async function fetchGenders() {
            const res = await fetch('/api/genders', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await res.json();
            console.log('gender data: ', data)
            setGenders(Array.isArray(data) ? data : []);
        }

        fetchGenders();
    }, []);

    const logout = async () => {
        await signOut({ redirect: false });
        router.push("/interpret");
    }

    const subscription = async () => {
        window.location.href = '/cancelSubscription';
    }

    const createAccount = () => {
        router.push("/createAccount");
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        const userData = {
            genderID: selectedGenderID,
            culturalBackground,
            spiritualPractices,
            age,
            userID: user._id
        };
        try {
            const response = await axios.post('/api/user/updatePersonalData', userData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log('User Data successfully updated:', response.data);
            setError(''); // Clear any previous errors
            router.push("/interpret");
        } catch (error) {
            console.error('Error updating user data:', error);
            setError('Failed to update user data. Please try again.');
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="main-content text-white flex justify-center items-center h-screen">
                <div className='loadingContainer'>
                    <p className='loadingText'>Transporting to Dream Profile</p>
                    <div className='dotsContainer'>
                        <div className='dot delay200'></div>
                        <div className='dot delay400'></div>
                        <div className='dot'></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            {!session && (
                <div className="overlay-message w-full md:w-fit golden-ratio-3">
                    <p>Create an account to update profile</p>
                    <button className="create-account-button" onClick={createAccount}>Create Account</button>
                </div>
            )}
            <div className={`main-content golden-ratio-2 text-white ${!session && "blur-effect"}`}>
                <h1 className="text-white text-center golden-ratio-4 p-0">Profile</h1>
                <p className="font-bold golden-ratio-3 pl-4">{user.name}</p>
                <p className="pl-4">{user.email}</p>
                <div className="pl-4">
                    {user.dreamCount === 1 ? (
                        <p>1 dream journaled</p>
                    ) : user.dreamCount ? (
                        <p>{user.dreamCount} dream&apos;s journaled</p>
                    ) : (
                        <p>0 Dream&apos;s Journaled</p>
                    )}
                </div>
                <form onSubmit={handleSubmit} className="pl-4">
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <p style={{ marginRight: '10px' }}>Gender: </p>
                        {genders.map((gender) => (
                            <label key={gender.genderID} style={{ marginRight: '15px' }}>
                                <input 
                                    type="radio" 
                                    value={gender.genderID} 
                                    checked={selectedGenderID === gender.genderID} 
                                    onChange={() => setSelectedGenderID(gender.genderID)} 
                                    style={{ marginRight: '5px' }}
                                /> 
                                {gender.name}
                            </label>
                        ))}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                        <p style={{ marginRight: '10px' }}>Age: </p>
                        <input 
                            type="number" 
                            className="DreamBox rounded-md px-1"
                            value={age} 
                            onChange={(e) => setAge(e.target.value)} 
                            placeholder="Age" 
                            style={{ width: '100px' }}
                        />
                    </div>
                    <div>
                        <p>Cultural Background: </p>
                        <input 
                            type="text" 
                            className="DreamBox rounded-md px-1"
                            value={culturalBackground} 
                            onChange={(e) => setCulturalBackground(e.target.value)} 
                            placeholder="Enter your cultural background" 
                            style={{ width: '300px' }}
                        />
                    </div>
                    <div>
                        <p>Religious/Spiritual Practices: </p>
                        <input 
                            type="text" 
                            className="DreamBox rounded-md px-1"
                            value={spiritualPractices} 
                            onChange={(e) => setSpiritualPractices(e.target.value)} 
                            placeholder="Enter your religious/spiritual practices" 
                            style={{ width: '300px' }}
                        />
                    </div>
                    {error && <p className="text-red-500">{error}</p>}
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                        {saving ? (
                            <div className='dotsContainer'>
                                <div className='dot delay200'></div>
                                <div className='dot delay400'></div>
                                <div className='dot'></div>
                            </div>
                        ) : (
                            <button type="submit" className="dream-button">Save Changes</button>
                        )}
                    </div>
                </form>
                <div className="logout absolute bottom-0 right-0 p-4">
                    <button onClick={logout} className="back-button">Log Out</button>
                    {/* {subscribed && <button onClick={subscription} className="dream-button">Cancel Subscription</button>} */}
                </div>
                <ContactAndPrivacyButtons />
            </div>
        </div>
    )
}

export default SettingsForm;
