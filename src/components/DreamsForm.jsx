"use client";
import React, { useState, useEffect, useRef, lazy } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import 'reactjs-popup/dist/index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { faTrash, faStar, faStarHalfStroke, faArrowRight, faArrowLeft} from '@fortawesome/free-solid-svg-icons';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
const LoadingComponent = lazy(() => import('./LoadingComponent'));
import InfoPopup from './InfoPopup';


export default function DreamsForm() {
    const { data: session, status } = useSession();
    const [dreams, setDreams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [noDreams, setNoDreams] = useState(false);
    const [weekOffset, setWeekOffset] = useState(0); // 0 means the current week, -1 means the previous week, and so on.
    const [firstDayOfWeek, setFirstDayOfWeek] = useState(null);
    const [lastDayOfWeek, setLastDayOfWeek] = useState(null);
    const [selectedSort, setSelectedSort] = useState('Week');
    const [sortType, setSortType] = useState(1);
    const [dropdownActive, setDropdownActive] = useState(false);

    const dropdownMenuRef = useRef(null);

    useEffect(() => {
        const getDreams = async () => {
            if (status === 'loading') {
                return;
            }

            if (session) {
                setLoading(true);
                const res = await axios.get('api/dream/user/' + session.user.email);
                let sortedDreams;
                if (res.data.length === 0) {
                    setNoDreams(true);
                    setLoading(false);
                    return;
                }

                // Calculate the start and end dates for the week
                if (sortType === 1) {
                    const today = new Date();
                    const dayOfWeek = today.getDay(); // Sunday - 0, Monday - 1, etc.
                    const startOfWeek = new Date(today);
                    startOfWeek.setDate(today.getDate() - dayOfWeek + (weekOffset * 7));
                    startOfWeek.setHours(0, 0, 0, 0);
                    setFirstDayOfWeek(startOfWeek);
                    const endOfWeek = new Date(startOfWeek);
                    endOfWeek.setDate(startOfWeek.getDate() + 7);
                    setLastDayOfWeek(endOfWeek);

                    // Filter dreams within the week
                    const filteredDreams = res.data.filter(dream => {
                        const dreamDate = new Date(dream.dreamDate);
                        return dreamDate >= startOfWeek && dreamDate < endOfWeek;
                    });

                    // Sort dreams by date
                    sortedDreams = filteredDreams.sort((a, b) => {
                        return new Date(b.dreamDate) - new Date(a.dreamDate);
                    });
                } else if (sortType === 2) {
                    const filteredDreams = res.data.filter(dream => dream.starred);
                    sortedDreams = filteredDreams.sort((a, b) => {
                        return new Date(b.dreamDate) - new Date(a.dreamDate);
                    });
                } else if (sortType === 3) {
                    sortedDreams = res.data.sort((a, b) => {
                        return new Date(b.dreamDate) - new Date(a.dreamDate);
                    });
                }

                setDreams(sortedDreams);
                setLoading(false); // Set loading to false after dreams are fetched
            }
            else {
                setLoading(false);
            }
        };

        getDreams();
    }, [session, weekOffset, sortType]);

    const goToNextWeek = () => {
        setWeekOffset(weekOffset + 1);
    };

    const goToPreviousWeek = () => {
        setWeekOffset(weekOffset - 1);
    };

    const formatDreamDate = (dreamDate) => {
        const date = new Date(dreamDate);
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const year = date.getFullYear();
        return month + "/" + day + "/" + year;
    }

    const dropdown = () => {
        if (dropdownActive) {
            dropdownMenuRef.current.classList.remove("active");
            setDropdownActive(false);
        } else {
            setDropdownActive(true);
            dropdownMenuRef.current.classList.add("active");
        }
    }

    const updateSortType = (sortTypeID) => {
        setSortType(sortTypeID);
        if (sortTypeID === 1) {
            setWeekOffset(0);
            setSelectedSort('Week');
        } else if (sortTypeID === 2) {
            setSelectedSort('Starred');
        } else if (sortTypeID === 3) {
            setSelectedSort('All');
        }
        dropdown();
    }

    const deleteDream = async (dreamID) => {
        const res = await axios.post('/api/dream/delete', { dreamID });
        if (res.status === 200) {
            const newDreams = dreams.filter(dream => dream._id !== dreamID);
            if (newDreams.length === 0) {
                setNoDreams(true);
            }
            setDreams(newDreams);
        }
    }

    const starDream = async (dreamID, starredStatus) => {
        const res = await axios.post('/api/dream/star', { dreamID, starredStatus });
        if (res.status === 200) {
            const newDreams = dreams.map(dream => {
                if (dream._id === dreamID) {
                    dream.starred = !starredStatus;
                }
                return dream;
            });
            setDreams(newDreams);
        }
    }

    const createAccount = () => {
        window.location.href = '/register';
    }

    if (loading) {
        return (
            <LoadingComponent loadingText={'Preparing Your Dream Journal'} />
        );
    }

    return (
        <div className='text-white main-content relative golden-ratio-2'>
            {!session && (
                <div className="overlay-message w-full md:w-fit golden-ratio-3">
                    <p>Create an account to start a dream journal</p>
                    <button className="create-account-button" onClick={createAccount}>Create Account</button>
                </div>
            )}
            <div className={`${!session && "blur-effect"}`}>
                <div className="golden-ratio-3 leading-none pb-2 text-center">
                    <p className="text-center flex items-center justify-center font-bold">{session?.user.name}&apos;s Dream Journal</p>
                </div>
                <div className="flex justify-between">
                    <div className="ml-3 items-center flex dropdown cursor-pointer border border-white p-2 rounded-lg select-none mb-1" onClick={dropdown}>
                        Sort by: <span className="font-bold ml-1">{selectedSort}</span>
                        <div ref={dropdownMenuRef} className="dropdown-menu">
                            <p className="dropdown-item" onClick={() => updateSortType(1)}>Week</p>
                            <p className="dropdown-item" onClick={() => updateSortType(2)}>Starred</p>
                            <p className="dropdown-item" onClick={() => updateSortType(3)}>All</p>
                        </div>
                    </div>
                    {lastDayOfWeek && sortType === 1 && (
                        <div className="flex justify-center items-center text-center golden-ratio-2">
                            <FontAwesomeIcon icon={faArrowLeft} className="p-2 wiggle cursor-pointer" onClick={goToPreviousWeek} />
                            <span>{formatDreamDate(firstDayOfWeek)} - {formatDreamDate(lastDayOfWeek)}</span>
                            <FontAwesomeIcon icon={faArrowRight} className="p-2 wiggle cursor-pointer mr-1" onClick={goToNextWeek} />
                        </div>
                    )}
                </div>
                {noDreams && (
                    <div className="flex text-center justify-center inset-0 items-center pt-20 pb-5">
                        <p className="text-center text-3xl pr-3">You have no saved dreams. Get dreaming!</p>
                    </div>
                )}
                {session && !noDreams && (
                    <div className="flex flex-wrap justify-center px-2 sm:px-0">
                        {dreams.map((dream) => (
                            <div key={dream._id} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2">
                                <DreamCard dream={dream} deleteDream={deleteDream} starDream={starDream} formatDreamDate={formatDreamDate} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

const DreamCard = ({ dream, deleteDream, starDream, formatDreamDate }) => {
    const dreamLength = (dreamText) => {
        if (dreamText.length > 100) {
            return dreamText.substring(0, 100) + '...';
        } else {
            return dreamText;
        }
    }

    return (
        <div className="relative p-5 border rounded-lg shadow-md overflow-hidden border-gold-small">
            <Link href={{
                pathname: '/dreamDetails',
                query: { dreamID: dream._id },
            }}>
                <div>
                    <p className="p-2">
                        {dreamLength(dream.dream)}
                    </p>
                </div>
            </Link>
            <p className="absolute left-0 top-0 p-1">
                {formatDreamDate(dream.dreamDate)}
            </p>
            <p className="absolute bottom-0 left-0 font-bold p-2 text-gold">
                {dream.interpretation ? 'Interpretations' : ''}
            </p>
            <FontAwesomeIcon 
                icon={faTrash} 
                size="x" 
                className="absolute right-0 bottom-0 p-2 wiggle cursor-pointer"
                onClick={() => deleteDream(dream._id)}    
            />
            {dream.starred ? (
                <FontAwesomeIcon 
                    icon={faStar} 
                    size="x" 
                    className="absolute right-0 top-0 p-2 wiggle cursor-pointer"
                    onClick={() => starDream(dream._id, dream.starred)}
                />
            ) : (
                <FontAwesomeIcon 
                    icon={faStarHalfStroke} 
                    size="x" 
                    className="absolute right-0 top-0 p-2 wiggle cursor-pointer"
                    onClick={() => starDream(dream._id, dream.starred)}
                />
            )}
        </div>
    )
}