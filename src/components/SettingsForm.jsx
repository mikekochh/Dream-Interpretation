"use client";
import React, { useState, useEffect, lazy, useRef, useContext } from 'react';
import { useSession } from 'next-auth/react';
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import ContactAndPrivacyButtons from './ContactAndPrivacyButtons';
import axios from 'axios';
const LoadingComponent = lazy(() => import('./LoadingComponent'));
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import OracleSection from './OracleSection';
import InfoPopup from './InfoPopup';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import PurchaseButton from './PurchaseButton';

import { UserContext } from '@/context/UserContext';

const EditProfileModal = ({ 
    isOpen, 
    onClose, 
    onSave, 
    genders, 
    selectedGenderID, 
    setSelectedGenderID, 
    culturalBackground, 
    setCulturalBackground, 
    spiritualPractices, 
    setSpiritualPractices, 
    birthdate, 
    setBirthdate, 
    name, 
    setName, 
    error, 
    saving 
}) => {
    if (!isOpen) return null;

    const handleDateChange = (date) => {
        setBirthdate(date);
    };

    const isValidDate = (date) => {
        return date instanceof Date && !isNaN(date);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content relative">
                <button className="absolute top-2 right-2 text-gray-700 hover:text-black" onClick={onClose}>
                    <FontAwesomeIcon icon={faTimes} />
                </button>
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
                                <option key={gender.genderID} value={gender.genderID}>
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
                            selected={isValidDate(new Date(birthdate)) ? new Date(birthdate) : null}
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
    const { data: session, status } = useSession();

    const { user, logout, toggleEmailNotifications, toggleEmailMarketing } = useContext(UserContext);

    const [genders, setGenders] = useState([]);
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // State variables for displaying user profile
    const [displayGender, setDisplayGender] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [displayCulturalBackground, setDisplayCulturalBackground] = useState('');
    const [displaySpiritualPractices, setDisplaySpiritualPractices] = useState('');
    const [displayBirthdate, setDisplayBirthdate] = useState('');

    // State variables for modal inputs
    const [selectedGenderID, setSelectedGenderID] = useState('');
    const [name, setName] = useState('');
    const [culturalBackground, setCulturalBackground] = useState('');
    const [spiritualPractices, setSpiritualPractices] = useState('');
    const [birthdate, setBirthdate] = useState(new Date());

    const scrollContainerRef = useRef(null);

    const [oracles, setOracles] = useState([]);
    const [selectedOracleID, setSelectedOracleID] = useState(0);

    useEffect(() => {
        const getOracles = async () => {
            try {
                const oraclesRes = await axios.get('/api/allOracles')
                setOracles(oraclesRes.data);
            } catch (error) {
                console.error("Error fetching oracles:", error);
            }
        };

        getOracles();
    }, []);

    useEffect(() => {
        if (user) {
            setDisplayGender(getGenderName(user.genderID) || '');
            setDisplayName(user.name || '');
            setDisplayCulturalBackground(user.culturalBackground || '');
            setDisplaySpiritualPractices(user.spiritualPractices || '');
            setDisplayBirthdate(new Date(user.birthdate).toLocaleDateString() || '');
            setSelectedOracleID(user.metaAnalysisOracleID || 0);
    
            setOracles(prevOracles => {
                const updatedOracles = prevOracles.map(oracle => ({
                    ...oracle,
                    selected: oracle.oracleID === user.metaAnalysisOracleID
                }));
                
                // Move the selected oracle to the front
                if (user.metaAnalysisOracleID) {
                    const selectedOracleIndex = updatedOracles.findIndex(oracle => oracle.oracleID === user.metaAnalysisOracleID);
                    if (selectedOracleIndex !== -1) {
                        const [selectedOracle] = updatedOracles.splice(selectedOracleIndex, 1);
                        updatedOracles.unshift(selectedOracle);
                    }
                }
                
                return updatedOracles;
            });
        }
    }, [user])

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

    const handleLogout = async () => {
        await logout();
        router.push("/interpret");
    };

    const createAccount = () => {
        router.push("/register");
    };

    async function getGenderName(genderID) {
        try {
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
            userID: user._id,
            name
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
            // Update the display variables
            setDisplayGender(getGenderName(selectedGenderID));
            setDisplayName(name);
            setDisplayCulturalBackground(culturalBackground);
            setDisplaySpiritualPractices(spiritualPractices);
            setDisplayBirthdate(birthdate.toLocaleDateString());
            window.location.reload();
        } catch (error) {
            console.error('Error updating user data:', error);
            setError('Failed to update user data. Please try again.');
            setSaving(false);
        }
    };

    const openModal = () => {
        setSelectedGenderID(user.genderID || '');
        setCulturalBackground(user.culturalBackground || '');
        setSpiritualPractices(user.spiritualPractices || '');
        setName(user.name || '');
        setBirthdate(new Date(user.birthdate) || new Date());
        setIsModalOpen(true);
    };

    function handleSelectionChange(selected, oracleID) {
        setOracles(prev => {
            const updatedOracles = prev.map(oracle => ({
                ...oracle,
                selected: false
            }));
            const oracleIndex = updatedOracles.findIndex(oracle => oracle.oracleID === oracleID);
            if (oracleIndex !== -1) {
                updatedOracles[oracleIndex].selected = true;
            }
            return updatedOracles;
        });
        setSelectedOracleID(oracleID);
    }


    const selectOracle = () => {
    }

    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
        }
    };

    const turnOffMetaAnalysis = async () => {
        try {
            const userID = user._id;
            await axios.post('/api/user/updateMetaAnalysisOracleID', {
                userID,
                oracleID: 0
            })
            window.location.reload();
        } catch (error) {
            console.log("There was an error turning off meta-analysis: ", error);
        }
    }

    const updateMetaAnalysisOracle = async () => {
        try {
            const userID = user._id;
            await axios.post('/api/user/updateMetaAnalysisOracleID', {
                userID,
                oracleID: selectedOracleID
            })
            window.location.reload();
        } catch (error) {
            console.log("There was an error updating meta-analysis oracle: ", error);
        }
    }

    const onClose = () => {
        setIsModalOpen(false)
    }

    const handleClickEmailNotification = async () => {
        console.log("handleClickEmailNotification running...");
        toggleEmailNotifications();
    }

    const handleClickEmailMarketing = async () => {
        console.log("handleClickEmailMarketing running...");
        toggleEmailMarketing();
    }

    if (!user) {
        return (
            <LoadingComponent loadingText={'Transporting to Dream Profile'} />
        );
    }

    return (
        <div className="h-screen overflow-hidden">
            {!session && (
                <div className="overlay-message w-full md:w-fit golden-ratio-3">
                    <p>Create an account to update profile</p>
                    <button className="create-account-button" onClick={createAccount}>Create Account</button>
                </div>
            )}
            <div className={`main-content golden-ratio-2 text-white ${!session && "blur-effect"}`}>
                <h1 className="text-white text-center golden-ratio-4 p-0 pb-4">Profile</h1>
                <div className="flex items-center">
                    <p className="font-bold golden-ratio-3 px-4">{displayName}</p>
                    <button className="start-button-small golden-ratio-1" onClick={openModal}>Edit Profile</button>
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
                {user.subscribed ? (
                    <>
                        <form className="pl-4 pt-8">
                            <div className="golden-ratio-3 font-bold">
                                Personal Details
                            </div>
                            {(!displayGender || !displayBirthdate || !displayCulturalBackground || !displaySpiritualPractices) && (
                                <button
                                    className="golden-ratio-2"
                                    style={{
                                        color: 'red',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        textDecoration: 'underline'
                                    }}
                                    onClick={(event) => {
                                        event.preventDefault();
                                        openModal();
                                    }}
                                >
                                    Missing Information
                                </button>
                            )}
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                {displayGender && (
                                    <p style={{ marginRight: '10px' }}>{displayGender}</p>
                                )}
                            </div>
                            <div>
                                {displayBirthdate && !isNaN(new Date(displayBirthdate)) && (
                                    <p style={{ marginRight: '10px' }}>Born on {displayBirthdate}</p>
                                )}
                            </div>
                            <div>
                                {displayCulturalBackground && (
                                    <p>{displayCulturalBackground} Cultural Background</p>
                                )}
                            </div>
                            <div>
                                {displaySpiritualPractices && (
                                    <p>Religious/Spiritual Practices: {displaySpiritualPractices}</p>
                                )}
                            </div>
                        </form>
                        <div>
                            <div className="pl-4 pb-4 pt-8">
                                <div className="golden-ratio-3 font-bold">Member Preferences</div>
                            </div>
                            <div className="md:w-11/12 md:mx-auto">
                                <div className="text-center">
                                    <div>Select Meta-Analysis Dream Oracle
                                        <span className="golden-ratio-1">
                                            <InfoPopup 
                                                icon={faQuestionCircle} 
                                                infoText={"Unlock deeper insights into your subconscious with our Weekly Dream Meta-Analysis. This feature compiles and analyzes all the dreams you've journaled throughout the week, offering a comprehensive overview of recurring themes, symbols, and emotions. Simply select your preferred Dream Oracle to conduct the meta-analysis, and receive a detailed interpretation that reveals patterns and hidden meanings in your dreamscapes."}
                                                infoTitle={'Weekly Dream Meta-Analysis'}
                                                hasAccess={true}
                                            />
                                        </span>
                                    </div>
                                    {selectedOracleID === 0 && (
                                    <div 
                                        className="golden-ratio-2 underline"
                                        style={{color: 'red'}}
                                    >
                                        Please Select Below
                                    </div>
                                    )}
                                </div>
                                <div className="flex items-center justify-center relative pt-2">
                                    <button onClick={scrollLeft} className="absolute left-0 z-10 p-2 bg-white bg-opacity-25 rounded-full shadow-md hover:bg-opacity-50 md:hidden">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                                        </svg>
                                    </button>
                                    <div ref={scrollContainerRef} className="flex overflow-x-auto scroll-smooth scrollbar-hide md:overflow-x-visible md:flex-row">
                                        {oracles.filter(oracle => oracle.active).map((oracle) => (
                                            <div key={oracle._id} className="flex-none mx-2 md:flex-auto">
                                                <OracleSection oracle={oracle} handleSelectionChange={handleSelectionChange} selectOracle={selectOracle} user={user} />
                                            </div>
                                        ))}
                                    </div>
                                    <button onClick={scrollRight} className="absolute right-0 z-10 p-2 bg-white bg-opacity-25 rounded-full shadow-md hover:bg-opacity-50 md:hidden">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                        </svg>
                                    </button>
                                </div>
                                <div className="text-center">
                                    <button 
                                        className={`start-button-small golden-ratio-1 ${selectedOracleID === user?.metaAnalysisOracleID ? 'opacity-50 cursor-not-allowed' : ''}`} 
                                        onClick={updateMetaAnalysisOracle}
                                        disabled={selectedOracleID === user?.metaAnalysisOracleID}
                                    >
                                        Update Meta-Analysis
                                    </button>
                                    {selectedOracleID !== 0 && (
                                        <button
                                            className='start-button-small golden-ratio-1'
                                            onClick={turnOffMetaAnalysis}
                                        >
                                            Turn Off Meta-Analysis
                                        </button>
                                    )}
                                    
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="text-center golden-ratio-1 mt-8">
                        <p className="golden-ratio-3 font-bold mb-3">Subscribe to enjoy all member features.</p>
                        <PurchaseButton buttonText={"Start Now"} user={user}></PurchaseButton>
                    </div>
                )}
        <div>
            <div className="pl-4 pb-4 pt-8">
                <div className="golden-ratio-3 font-bold">Notification Settings</div>

                <div className="mt-5">
                    <label className="flex items-center cursor-pointer">
                        <span className="mr-3 text-lg font-semibold">Email Notifications</span>
                        <button
                            onClick={handleClickEmailNotification}
                            className={`relative w-12 h-6 flex items-center rounded-full transition-colors duration-300 ${
                                user?.optOutEmailNotifications ? 'bg-gray-300' : 'bg-gold'
                            }`}
                        >
                            <span
                                className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                                    user?.optOutEmailNotifications ? 'translate-x-6' : 'translate-x-1'
                                }`}
                            ></span>
                        </button>
                    </label>
                </div>

                <div className="mt-5">
                    <label className="flex items-center cursor-pointer">
                        <span className="mr-3 text-lg font-semibold">Marketing Emails</span>
                        <button
                            onClick={handleClickEmailMarketing}
                            className={`relative w-12 h-6 flex items-center rounded-full transition-colors duration-300 ${
                                user?.optOutEmailMarketing ? 'bg-gray-300' : 'bg-gold'
                            }`}
                        >
                            <span
                                className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                                    user?.optOutEmailMarketing ? 'translate-x-6' : 'translate-x-1'
                                }`}
                            ></span>
                        </button>
                    </label>
                </div>
            </div>
        </div>
                <div>
                    <div className="pl-4 pb-4 pt-8">
                        <div className="golden-ratio-3 font-bold">Support & Policies</div>
                        <ContactAndPrivacyButtons />
                        <button className='golden-ratio-2 underline pl-1' onClick={handleLogout}>Logout</button>
                    </div>
                </div>
                <div className="image-container text-center">
                    <Image src="/mandela.webp" alt="Mandela" width={500} height={500} className="mandela-image" />
                </div>
            </div>

            <EditProfileModal
                isOpen={isModalOpen}
                onClose={onClose}
                onSave={handleSubmit}
                genders={genders}
                selectedGenderID={selectedGenderID}
                setSelectedGenderID={setSelectedGenderID}
                culturalBackground={culturalBackground}
                setCulturalBackground={setCulturalBackground}
                spiritualPractices={spiritualPractices}
                setSpiritualPractices={setSpiritualPractices}
                birthdate={birthdate}
                setBirthdate={setBirthdate}
                name={name}
                setName={setName}
                error={error}
                saving={saving}
            />
        </div>
    );
};

export default SettingsForm;
