"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp} from '@fortawesome/free-solid-svg-icons';

export default function DreamnetForm() { 

    const { data: session } = useSession();

    const [dreams, setDreams] = useState([]);
    const [likes, setLikes] = useState([]); 
    const [mainUserID, setMainUserID] = useState(null);

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
                setMainUserID(userData._id);
            }).catch(err => {
                console.log('err: ', err);
            });
        }
    }, [session]);

    useEffect(() => {
        const getDreams = async function() {
            try {
                const res = await axios.get('/api/dreamnet/publicDreams');
                setDreams(res.data.dreamsSorted);
            } catch (error) {
                console.log(error);
            }
        }

        getDreams();
    }, []);

    useEffect(() => {
        const getLikesByUser = async function() {
            try {
                const res = await axios.get('/api/dreamnet/likes/' + mainUserID);
                console.log(res.data.likes);
                setLikes(res.data.likes);
            } catch (error) {
                console.log(error);
            }
        }

        if (mainUserID) {
            getLikesByUser();
        }
    }, [mainUserID]);

    const formatDate = (date) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(date).toLocaleDateString(undefined, options);
    }

    return (
        <div className='main-content text-white'>
            <h1 className="text-center text-3xl">Dreamnet</h1>
            <div className="flex flex-col justify-center">
                {dreams.map((dream, index) => {

                    const liked = likes.filter(like => like.dreamID === dream._id).length > 0;

                    return (
                        <div key={index}><DreamBox dream={dream} formatDate={formatDate} mainUserID={mainUserID} liked={liked}/></div>
                    )
                })}
            </div>
        </div>
    )
}


const DreamBox = ({ dream, formatDate, mainUserID, liked }) => {

    const likeDream = async (dreamID, userID) => {
        try {
            const res = await axios.post('/api/dreamnet/like', 
            { 
                dreamID, 
                giverID: mainUserID, 
                receiverID: userID
            });
            console.log(res);
        } catch (error) {
            console.log(error);
        }
    }

    const removeLike = async (dreamID, userID) => {
        try {
            const res = await axios.post('/api/dreamnet/removeLike', 
            { 
                dreamID, 
                giverID: mainUserID, 
                receiverID: userID
            });
            console.log(res);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="flex justify-center">
            <div className="dream-box flex flex-col md:w-3/4 w-full m-1">
                <div className="dream">{dream.dream}</div>
                <div className="interpretation">{dream.interpretation}</div>
                <div className="dream-date">{formatDate(dream.dreamDate)}</div>
                <div className="likes">Likes: {dream.likes}</div>
                <div className="like-container flex justify-end">
                {liked ? (
                    <div className="border border-1 rounded-md w-fit p-1 text-right cursor-pointer dreamnet-liked-button" onClick={() => removeLike(dream._id, dream.userID)}>
                        Liked <FontAwesomeIcon icon={faThumbsUp} />
                    </div>
                ) : (
                    <div className="border border-1 rounded-md w-fit p-1 text-right cursor-pointer dreamnet-like-button" onClick={() => likeDream(dream._id, dream.userID)}>
                        Like <FontAwesomeIcon icon={faThumbsUp} />
                    </div>
                )}
                </div>
            </div>
        </div>
    )
}