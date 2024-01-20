"use client";
import BlogForm from "@/components/BlogForm";
import StarBackground from "@/components/StarBackground";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";

export default function BlogsPage() {

    return (
        <StarBackground>
            <BlogForm />
        </StarBackground>
    )
}