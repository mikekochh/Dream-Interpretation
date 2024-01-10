"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import BlogContentOne from './blogs/blogContentOne';

// &apos;

export default function BlogForm({ blogDetails }) { 

    const router = useRouter();
    const [likes, setLikes] = useState(0);
    const [hasUserLiked, setHasUserLiked] = useState(false);


    useEffect(() => {
        setLikes(blogDetails.likes);
    }, [blogDetails]);

    useEffect(() => {
        if (blogDetails) {
            const hasUserLikedTemp = localStorage.getItem('hasUserLiked' + blogDetails.blogID);
            if (hasUserLikedTemp) {
                setHasUserLiked(true);
            }
        }
    }, [hasUserLiked, blogDetails]);

    const likeBlog = async function() {
        const hasUserLikedTemp = localStorage.getItem('hasUserLiked' + blogDetails.blogID);
        if (hasUserLiked) {
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
            console.log(res);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="main-content relative text-left">
        <meta name="description" content={blogDetails.description} />
            <button onClick={() => router.push('/blog')} className="bg-white rounded-xl p-2 text-black m-2 md:hidden">Back</button>
            <button onClick={() => router.push('/blog')} className="bg-white rounded-xl p-2 text-black m-2 hidden absolute top-15 left-0">Back</button>
            <div className="flex justify-center items-center">
                <div className="text-white text-lg text-left w-11/12 md:w-3/4 items-center justify-center">
                    {/* Mobile */}
                    <div className="mb-4 relative md:hidden" style={{ width: '100%' }}>
                        <Image 
                            layout="responsive"
                            width={100}
                            height={100}
                            objectFit="contain"
                            src="/blog1.webp" 
                            alt="blog picture" 
                            className="rounded-xl"
                        />
                    </div>
                    {/* Desktop */}
                    <div className="mb-4 relative hidden md:block mx-auto" style={{ width: '50%' }}>
                        <Image 
                            layout="responsive"
                            width={100}
                            height={100}
                            objectFit="contain"
                            src="/blog1.webp" 
                            alt="blog picture" 
                            className="rounded-xl"
                        />
                    </div>
                    <h1 className="text-5xl text-center pb-4">{blogDetails.blogTitle}</h1>
                    <h2 className="text-xl text-center pb-4">Estimated reading time: {blogDetails.readingTime} mins</h2>
                    <BlogContentOne />
                </div>
            </div>
            <div className="text-center">
                <button onClick={() => router.push('/journal')} className="dream-button">Interpret Your Dreams!</button>
            </div>
            <div>
                <div className="text-white text-right flex flex-row justify-end items-center">
                    <p className="mr-2">Likes: {likes}</p>
                    {!hasUserLiked ? (
                        <FontAwesomeIcon icon={faThumbsUp} onClick={likeBlog} className="mr-2 wiggle" />
                    ) : (
                        <p className="text-green-500 mr-2">Liked!</p>
                    )}
                </div>
            </div>
        </div>

    )
}