"use client";
import BlogForm from "@/components/blogForm";
import StarBackground from "@/components/StarBackground";
import { usePathname } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";

export default function BlogsPage() {

    const [blogID, setBlogID] = useState(0);
    const [blogDetails, setBlogDetails] = useState({});

    const searchParams = useSearchParams();
    

    useEffect(() => {
        const blogId = searchParams.get('blogID');

        console.log("blogId: " + blogId);

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
            setBlogID(Number(blogId));
        }

    }, [searchParams]);

    return (
        <StarBackground>
            <BlogForm blogDetails={blogDetails} />
        </StarBackground>
    )
}