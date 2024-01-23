"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown, faCopy, faCheck } from '@fortawesome/free-solid-svg-icons';
import Head from 'next/head';

export default function BlogForm({ blogDetails, Content }) { 

    const router = useRouter();
    const [likes, setLikes] = useState(0);
    const [dislikes, setDislikes] = useState(0);
    const [copied, setCopied] = useState(false);


    useEffect(() => {
        if (blogDetails) {
            setLikes(blogDetails.likes);
            setDislikes(blogDetails.dislikes);
        }
        
    }, [blogDetails]);

    const likeBlog = async function() {
        const hasUserLikedTemp = localStorage.getItem('hasUserLiked' + blogDetails.blogID);
        if (hasUserLikedTemp) {
            return;
        }
        else {
            localStorage.setItem('hasUserLiked' + blogDetails.blogID, true);
            setHasUserLiked(true);
        }
        setLikes(likes + 1);
        try {
            const res = await axios.post('/api/blog/like', {
                blogID: blogDetails.blogID
            });
        } catch (error) {
            console.log(error);
        }
    }

    const dislikeBlog = async function() {
        const hasUserDislikedTemp = localStorage.getItem('hasUserDisliked' + blogDetails.blogID);
        if (hasUserDislikedTemp) {
            return;
        }
        else {
            localStorage.setItem('hasUserDisliked' + blogDetails.blogID, true);
        }
        setDislikes(dislikes + 1);
        try {
            const res = await axios.post('/api/blog/dislike', {
                blogID: blogDetails.blogID
            });
        } catch (error) {
            console.log(error);
        }
    }

    const copyLink = function() {
        const link = window.location.href;
        navigator.clipboard.writeText(link);
        setCopied(true);
    }

    return (
        <div className="main-content relative text-left">
            <Head>
                <title>{blogDetails?.blogTitle}</title>
                <meta name="description" content={blogDetails?.description} />
            </Head>
            <button onClick={() => router.push('/blog')} className="bg-white rounded-xl p-2 text-black m-2 md:hidden">Back Mobile</button>
            <button onClick={() => router.push('/blog')} className="bg-white rounded-xl p-2 text-black m-2 hidden md:flex">Back</button>
            <div className="flex justify-center items-center">
                <div className="text-white text-lg text-left w-11/12 md:w-3/4 items-center justify-center">
                    {/* Mobile */}
                    <div className="mb-4 relative md:hidden" style={{ width: '100%' }}>
                        <Image 
                            layout="responsive"
                            width={100}
                            height={100}
                            objectFit="contain"
                            src={blogDetails?.blogPicture}
                            alt="blog picture" 
                            className="rounded-xl border border-white"
                        />
                    </div>
                    {/* Desktop */}
                    <div className="mb-4 relative hidden md:block mx-auto" style={{ width: '50%' }}>
                        <Image 
                            layout="responsive"
                            width={100}
                            height={100}
                            objectFit="contain"
                            src={blogDetails?.blogPicture}
                            alt="blog picture" 
                            className="rounded-xl border border-white"
                        />
                    </div>
                    <h1 className="text-5xl text-center pb-4">{blogDetails?.blogTitle}</h1>
                    <h2 className="text-xl text-center pb-4">Estimated reading time: {blogDetails?.readingTime} mins</h2>    
                    <Content />                
                </div>
            </div>
            <div className="text-center">
                <button onClick={() => router.push('/interpret')} className="dream-button">Interpret Your Dreams!</button>
            </div>
            <div className="text-2xl">
                <div className="text-white text-right flex flex-row justify-end items-center p-5">
                    <p className="mr-2">Share Link: </p>
                        {copied ? (
                            <FontAwesomeIcon icon={faCheck} className="mr-6" />
                        ) : (
                            <FontAwesomeIcon icon={faCopy} className="mr-6 wiggle cursor-pointer" onClick={copyLink} />
                        )}
                        <div className="like-dislike-wrapper">
                            <div className="like-button"> 
                                <FontAwesomeIcon icon={faThumbsUp} onClick={likeBlog} className="wiggle mr-1" />{likes}
                            </div>
                            <div className="divider"></div>
                            <div className="dislike-button">
                                <FontAwesomeIcon icon={faThumbsDown} onClick={dislikeBlog} className="wiggle mr-1" />{dislikes}
                            </div>
                        </div>
                </div>
            </div>
        </div>

    )
}