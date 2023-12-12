"use client";

import React, { useEffect, useState } from "react";
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation'

const NavBar = () => {

    const [noNavBarPage, setNoNavBarPage] = useState(false);
    const path = usePathname();

    useEffect(() => {
        if (path === '/login' || path === '/homePage' || path === '/register' || path === '/') {
            setNoNavBarPage(true);
        }
        else {
            setNoNavBarPage(false);
        }
    }, [path]);

    return (
        noNavBarPage ? null :
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
                    <li className={`cursor-pointer mr-4 Character`}>
                        <Link href="/characterSelection">Oracles</Link>
                    </li>
                    <li className={`cursor-pointer Settings`}>
                        <Link href="/settings">Settings</Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default NavBar;