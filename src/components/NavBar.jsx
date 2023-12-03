"use client";

import React, { useEffect } from "react";
import Link from 'next/link';
import Image from 'next/image';

const NavBar = () => {

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
                    <li className={`cursor-pointer mr-4 Journal`}>
                        <Link href="/journal">Journal</Link>
                    </li>
                    <li className={`cursor-pointer mr-4 Interpret`}>
                        <Link href="/dreams">Dreams</Link>
                    </li>
                    <li className={`cursor-pointer Character`}>
                        <Link href="/characterSelection">Characters</Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default NavBar;