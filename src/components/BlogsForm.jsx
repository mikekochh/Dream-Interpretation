"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function BlogsForm() { 

    const [blogs, setBlogs] = useState([]);
    const router = useRouter();

    useEffect(() => {
        const getBlogs = async function() {
            try {
                const res = await axios.get('/api/blogs');
                setBlogs(res.data.blogs);
                console.log(res.data.blogs);
            } catch (error) {
                console.log(error);
            }
        }
        getBlogs();
    }, []);

    return (
        <div className="text-white text-3xl text-center p-4 main-content">
            Blogs
            <div className="flex flex-wrap justify-center">
                {blogs.map((blog, index) => {
                    return (
                        <div key={index} className="blog-box flex flex-col" onClick={() => router.push("blogPage?blogID="+ blog.blogID)}>
                            <div className="blog-picture relative w-64 h-64 mb-4">
                                <Image 
                                    layout="fill"
                                    objectFit="cover"
                                    src={blog.blogPicture} 
                                    alt="blog picture" 
                                    className="rounded-xl"
                                />
                            </div>
                            <div>{blog.blogTitle}</div>
                            <div className="text-xl">Estimated reading time: {blog.readingTime} mins.</div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}