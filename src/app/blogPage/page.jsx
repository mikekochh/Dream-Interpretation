"use client";
import BlogForm from "@/components/BlogForm";
import StarBackground from "@/components/StarBackground";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";

export default function BlogsPage() {
    const [blogDetails, setBlogDetails] = useState({});

    const searchParams = useSearchParams();
    

    useEffect(() => {
        const blogId = searchParams.get('blogID');

        const getBlogDetails = async function() {
            try {
                const res = await axios.get('/api/blog/' + blogId);
                setBlogDetails(res.data.blogDetails);
            } catch (error) {
                console.log(error);
            }
        }

        if (blogId !== undefined) {
            getBlogDetails();
        }

    }, [searchParams]);

    return (
        <StarBackground>
            <BlogForm blogDetails={blogDetails} />
        </StarBackground>
    )
}