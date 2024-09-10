"use client";
import React, { useState, useEffect, lazy, useContext } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import 'reactjs-popup/dist/index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
const LoadingComponent = lazy(() => import('./LoadingComponent'));
import { UserContext } from '@/context/UserContext';

export default function DreamsForm() {
    const { session, status } = useContext(UserContext);
    const router = useRouter();

    const [dreams, setDreams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [noDreams, setNoDreams] = useState(false);
    const [weekOffset, setWeekOffset] = useState(0); // 0 means the current week
    const [firstDayOfWeek, setFirstDayOfWeek] = useState(null);
    const [lastDayOfWeek, setLastDayOfWeek] = useState(null);

    useEffect(() => {
        const getDreams = async () => {
            if (status === 'loading') return;

            if (session) {
                setLoading(true);
                const res = await axios.get('api/dream/user/' + session.user.id);

                if (res.data.length === 0) {
                    setNoDreams(true);
                    setLoading(false);
                    return;
                }

                // Calculate start and end of the week and set the days of the week
                const today = new Date();
                const startOfWeek = new Date(today);
                startOfWeek.setDate(today.getDate() - today.getDay() + weekOffset * 7); // Sunday as start
                startOfWeek.setHours(0, 0, 0, 0);
                setFirstDayOfWeek(startOfWeek);

                const endOfWeek = new Date(startOfWeek);
                endOfWeek.setDate(startOfWeek.getDate() + 6);
                setLastDayOfWeek(endOfWeek);

                const weekDays = [];
                for (let i = 0; i < 7; i++) {
                    const day = new Date(startOfWeek);
                    day.setDate(startOfWeek.getDate() + i);
                    weekDays.push(day);
                }

                // Filter dreams that occurred in the current week
                const filteredDreams = res.data.filter((dream) => {
                    const dreamDate = new Date(dream.dreamDate);
                    return dreamDate >= startOfWeek && dreamDate <= endOfWeek;
                });

                // Group dreams by day
                const groupedDreams = weekDays.map((day) => {
                    const dayDreams = filteredDreams.filter((dream) => {
                        const dreamDate = new Date(dream.dreamDate);
                        return dreamDate.toDateString() === day.toDateString();
                    });
                    return { day, dreams: dayDreams };
                });

                setDreams(groupedDreams);
                setLoading(false);
            } else {
                setLoading(false);
            }
        };

        getDreams();
    }, [session, weekOffset, status]);

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
    };

    const formatColumnDate = (dreamDate) => {
        const date = new Date(dreamDate);
        const shortDayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' }); // Get short day name, e.g., "Mon"
        const dayNumber = date.getDate(); // Get day number, e.g., "10"
        
        return `${shortDayOfWeek}\n${dayNumber}`; // Return in the format "Mon\n10"
    };

    if (loading) {
        return <LoadingComponent loadingText={'Preparing Your Dream Journal'} />;
    }

    return (
        <div className="text-white main-content relative golden-ratio-2">
            {!session && (
                <div className="overlay-message w-full md:w-fit golden-ratio-3">
                    <p>Create an account to start a dream journal</p>
                    <button className="create-account-button" onClick={() => router.push('/register')}>Create Account</button>
                </div>
            )}
            <div className={`${!session && "blur-effect"}`}>
                <div className="golden-ratio-3 leading-none pb-2 text-center">
                    <p className="text-center flex items-center justify-center font-bold">{session?.user.name}&apos;s Dream Journal</p>
                </div>
                <div className="flex justify-center mb-5">
                    {lastDayOfWeek && (
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
                    <div className="grid grid-cols-1 md:grid-cols-7 gap-0 mb-10">
                        {dreams.map((dayGroup, index) => (
                            <div key={index} className="md:border-l border-white p-2">
                                <h3 className="font-bold text-center whitespace-pre-line">{formatColumnDate(dayGroup.day)}</h3>
                                {dayGroup.dreams.length === 0 ? (
                                    <p className="text-center">No dreams</p>
                                ) : (
                                    <div className="space-y-1">
                                        {
                                            dayGroup.dreams.map((dream) => (
                                                <DreamCard key={dream._id} dream={dream} formatDreamDate={formatDreamDate} />
                                            ))
                                        }
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

const DreamCard = ({ dream }) => {
    const dreamLength = (dreamText) => {
        if (dreamText.length > 100) {
            return dreamText.substring(0, 100) + '...';
        } else {
            return dreamText;
        }
    };

    return (
        <div className="relative p-1 rounded-lg overflow-hidden dream-card">
            <Link href={{
                pathname: '/dreamDetails',
                query: { dreamID: dream._id },
            }}>
                <div>
                    <p className="golden-ratio-1">
                        {dreamLength(dream.dream)}
                    </p>
                </div>
            </Link>
        </div>
    );
};



