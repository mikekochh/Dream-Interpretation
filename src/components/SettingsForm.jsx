"use client";
import React, { useState, useEffect, lazy } from 'react';
import { useSession } from 'next-auth/react';
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import ContactAndPrivacyButtons from './ContactAndPrivacyButtons';
import axios from 'axios';
const LoadingComponent = lazy(() => import('./LoadingComponent'));
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const EditProfileModal = ({ 
    isOpen, 
    onClose, 
    onSave, 
    genders, 
    setSelectedGenderID, 
    selectedGenderID, 
    culturalBackground, 
    setCulturalBackground, 
    spiritualPractices, 
    setSpiritualPractices, 
    error, 
    saving,
    birthdate,
    setBirthdate,
    name,
    setName
 }) => {
    if (!isOpen) return null;

    const handleDateChange = (date) => {
        setBirthdate(date);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2 className="golden-ratio-2 text-center">Edit Profile</h2>
                <form onSubmit={onSave} className="space-y-1">
                    <div>
                        <label className="pr-1">Name: </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="border border-black rounded-md px-1"
                        />
                    </div>
                    <div>
                        <label className="pr-1">Gender:</label>
                        <select
                            value={selectedGenderID}
                            onChange={(e) => setSelectedGenderID(e.target.value)}
                            className="border border-black rounded-md p-1"
                        >
                            <option value="">Select Gender</option>
                            {genders.map((gender) => (
                                <option key={gender._id} value={gender._id}>
                                    {gender.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="pr-1">Cultural Background: </label>
                        <input
                            type="text"
                            value={culturalBackground}
                            onChange={(e) => setCulturalBackground(e.target.value)}
                            className="border border-black rounded-md px-1"
                        />
                    </div>
                    <div>
                        <label className="pr-1">Religious/Spiritual Practices: </label>
                        <input
                            type="text"
                            value={spiritualPractices}
                            onChange={(e) => setSpiritualPractices(e.target.value)}
                            className="border border-black rounded-md px-1"
                        />
                    </div>
                    <div>
                        <label>Birthdate: </label>
                        <DatePicker
                            selected={birthdate}
                            onChange={handleDateChange}
                            dateFormat="MM/dd/yyyy"
                            placeholderText='MM/DD/YYYY'
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode='select'
                            className='border border-black rounded-md px-1'
                        />
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <div className="text-center">
                        <button type="submit" className="start-button-small" disabled={saving}>
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button type="button" className="start-button-small" onClick={onClose}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

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
    const [birthdate, setBirthdate] = useState(new Date());
    const [gender, setGender] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

    useEffect(() => {});

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
            setUserData()
                .then((userData) => {
                    setUser(userData);
                    setSelectedGenderID(userData.genderID || '');
                    setCulturalBackground(userData.culturalBackground || '');
                    setSpiritualPractices(userData.spiritualPractices || '');
                    setGender(getGenderName(userData.genderID) || '');
                    setName(userData.name || '');
                    setLoading(false);
                })
                .catch((err) => {
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
            setGenders(Array.isArray(data) ? data : []);
        }

        fetchGenders();
    }, []);

    const logout = async () => {
        await signOut({ redirect: false });
        router.push("/interpret");
    };

    const subscription = async () => {
        window.location.href = '/cancelSubscription';
    };

    const createAccount = () => {
        router.push("/register");
    };

    async function getGenderName(genderID) {
        try {
            console.log("getGenderName is running...");
            const response = await axios.get(`/api/gender`, { params: { genderID } });
            if (response.data && response.data.name) {
                return response.data.name;
            }
        } catch (error) {
            console.error('Error fetching gender name:', error);
            return null;
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        const userData = {
            genderID: selectedGenderID,
            culturalBackground,
            spiritualPractices,
            birthdate,
            userID: user._id
        };
        try {
            const response = await axios.post('/api/user/updatePersonalData', userData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            setError(''); // Clear any previous errors
            setSaving(false);
            setIsModalOpen(false); // Close the modal after saving
            router.push("/interpret");
        } catch (error) {
            console.error('Error updating user data:', error);
            setError('Failed to update user data. Please try again.');
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <LoadingComponent loadingText={'Transporting to Dream Profile'} />
        );
    }

    return (
        <div className="">
            {!session && (
                <div className="overlay-message w-full md:w-fit golden-ratio-3">
                    <p>Create an account to update profile</p>
                    <button className="create-account-button" onClick={createAccount}>Create Account</button>
                </div>
            )}
            <div className={`main-content golden-ratio-2 text-white  ${!session && "blur-effect"}`}>
                <h1 className="text-white text-center golden-ratio-4 p-0">Profile</h1>
                <div className="flex items-center">
                    <p className="font-bold golden-ratio-3 px-4">{name}</p>
                    <button className="start-button-small golden-ratio-1" onClick={() => setIsModalOpen(true)}>Edit Profile</button>
                </div>
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
                <form className="pl-4">
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <p style={{ marginRight: '10px' }}>{gender}</p>
                    </div>
                    <div>
                        <p style={{ marginRight: '10px' }}>Born on birthdate</p>
                    </div>
                    <div>
                        <p>{culturalBackground} Cultural Background</p>
                    </div>
                    <div>
                        <p>Religious/Spiritual Practices: {spiritualPractices}</p>
                    </div>
                </form>
                <div className="">
                    <button onClick={logout} className="logout-button">Log Out</button>
                    {/* {subscribed && <button onClick={subscription} className="dream-button">Cancel Subscription</button>} */}
                </div>
                <ContactAndPrivacyButtons />
            </div>

            <EditProfileModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSubmit}
                user={user}
                genders={genders}
                setSelectedGenderID={setSelectedGenderID}
                selectedGenderID={selectedGenderID}
                culturalBackground={culturalBackground}
                setCulturalBackground={setCulturalBackground}
                spiritualPractices={spiritualPractices}
                setSpiritualPractices={setSpiritualPractices}
                error={error}
                saving={saving}
                birthdate={birthdate}
                setBirthdate={setBirthdate}
                name={name}
                setName={setName}
            />
        </div>
    );
};

export default SettingsForm;
