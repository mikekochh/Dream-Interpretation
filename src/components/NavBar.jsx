"use client";

import React from "react";
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from "next/navigation";

const NavBar = () => {

    const router = useRouter();

    return (
        <nav className="flex justify-between items-center w-full z-10 p-4 border-b bg-white">
            {/* Section for logo and ability to change based off of screen size */}
            <Link href="https://www.michaelgkoch.com">
                <div className="flex items-center cursor-pointer">
                    <Image src="/dream_icon.png" className="rounded-lg" objectFit="contain" width={32} height={32} alt="logo" />
                    <p className="text-black font-semibold text-lg ml-1">Dream Oracles</p>
                </div>
            </Link>

            {/* Section on the right */}
            <div className="flex justify-end items-center text-black">
                <ul className="flex">
                    <li className="cursor-pointer mr-4">
                        <Link href="/journal">Journal</Link>
                    </li>
                    <li className="cursor-pointer mr-4">
                        <Link href="/interpret">Interpret</Link>
                    </li>
                    <li className="cursor-pointer">
                        <Link href="/characterSelection">Characters</Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default NavBar;