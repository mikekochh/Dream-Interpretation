"use client";
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import 'reactjs-popup/dist/index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { faTrash, faStar, faStarHalfStroke, faArrowRight, faArrowLeft} from '@fortawesome/free-solid-svg-icons';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

export default function DreamsForm() { 

    const { data: session } = useSession();
    const [dreams, setDreams] = useState([]);
    const [loading, setLoading] = useState(false);
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
                }
                else if (sortType === 2) {
                    const filteredDreams = res.data.filter(dream => dream.starred);
                    sortedDreams = filteredDreams.sort((a, b) => {
                        return new Date(b.dreamDate) - new Date(a.dreamDate);
                    });
                }
                else if (sortType === 3) {
                    sortedDreams = res.data.sort((a, b) => {
                        return new Date(b.dreamDate) - new Date(a.dreamDate);
                    });
                }

                setDreams(sortedDreams);
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
        }
        else if (sortTypeID === 2) {
            setSelectedSort('Starred');
        }
        else if (sortTypeID === 3) {
            setSelectedSort('All');
        }
        dropdown();
    }

    // const metaAnalysis = () => {
    //     const res = axios.post('/api/dream/metaAnalysis', { email: session.user.email });
    // }

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

    return (
        <div className="text-white main-content relative golden-ratio-2">
            <InfoTag /> 
            {/* <button className="bg-white text-black p-2 rounded-lg mb-5" onClick={metaAnalysis}>Meta Analysis</button> */}
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
            {loading && (
                <div className="flex text-center justify-center inset-0 items-center pt-20 pb-5">
                    <p className="text-center text-3xl pr-3">Loading Dreams</p>
                    <div className="loader"></div>  
                </div>
            )}
            {noDreams && (
                <div className="flex text-center justify-center inset-0 items-center pt-20 pb-5">
                    <p className="text-center text-3xl pr-3">You have no saved dreams. Get dreaming!</p>
                </div>
            )}
            {session && (
                <div>
                    <div className="flex flex-wrap justify-center">
                        {dreams.map((dream) => (
                            <div key={dream._id} className="dream-card-mobile md:hidden">
                                <DreamCard dream={dream} deleteDream={deleteDream} starDream={starDream} formatDreamDate={formatDreamDate} />
                            </div>
                        ))}
                    </div>

                    <div className="flex-wrap justify-center hidden md:flex">
                        {dreams.map((dream) => (
                            <div key={dream._id} className="dream-card">
                                <DreamCard dream={dream} deleteDream={deleteDream} starDream={starDream} formatDreamDate={formatDreamDate} />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}


const DreamCard = ({ dream, deleteDream, starDream, formatDreamDate }) => {

    const dreamLength = (dream) => {
        if (dream.length > 150) {
            return dream.substring(0, 150) + '...';
        }
        else {
            return dream;
        }
    }

    return (
        <div>
            <Link href={{
                pathname: '/dreamDetails',
                query: { dreamID: dream._id },
            
            }}>
                <div className="p-5 relative">
                    <p>
                        <span className="font-bold"></span>{dreamLength(dream.dream)}
                    </p>
                </div>
            </Link>
            <p className="absolute left-0 top-0 p-1">
                <span className="font-bold"></span>{formatDreamDate(dream.dreamDate)}
            </p>
            <p className="absolute bottom-0 left-0 font-bold underline p-1">
                {dream.interpretation ? 'Interpretations' : ''}
            </p>
            <FontAwesomeIcon 
                        icon={faTrash} 
                        size="x" 
                        className="absolute right-0 bottom-0 p-2 wiggle"
                        onClick={() => deleteDream(dream._id)}    
            />
            {dream.starred ? (
                <FontAwesomeIcon 
                    icon={faStar} 
                    size="x" 
                    className="absolute right-0 top-0 p-2 wiggle"
                    onClick={() => starDream(dream._id, dream.starred)}
                />
            ) : (
                <FontAwesomeIcon 
                    icon={faStarHalfStroke} 
                    size="x" 
                    className="absolute right-0 top-0 p-2 wiggle"
                    onClick={() => starDream(dream._id, dream.starred)}
                />
            )}
        </div>
    )
}

const InfoTag = () => {

    const [open, setOpen] = useState(false);

    return (
        <div className="golden-ratio-3 leading-none pb-2 text-center">
            <p className="text-center flex items-center justify-center font-bold">Dream Journal <FontAwesomeIcon icon={faInfoCircle} className="cursor-pointer ml-2" onClick={() => setOpen(o => !o)}/></p>
            <div className="dropdown w-full md:w-3/4 flex flex-col md:flex-row">
                <div className={`${open ? 'popup-menu-active' : 'popup-menu'}`}>
                    <p className="text-xl select-none golden-ratio-2">
                        <b>Dream Journal</b><br/>
                        Each of your dreams are stored here. You can see the beginning of each dream, the date it was recorded, and whether or not it has been interpreted.<br/><br/>
                        You can filter dreams by week, starred, or all dreams. You can star dreams by clicking on the half star icon. You can delete dreams by clicking on the trash icon.
                    </p>
                </div>
            </div>
        </div>
    )
}