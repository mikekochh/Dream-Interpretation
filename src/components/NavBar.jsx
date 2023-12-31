"use client";

import React, { useEffect, useState } from "react";
import Link from 'next/link';
import Image from 'next/image';
import { faX, faListDots } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

const NavBar = () => {

    const [isOpen, setIsOpen] = useState(false);
    const [noNavBarElements, setNoNavBarElements] = useState(false);
    const { data: session } = useSession();
    const pathname = usePathname();
    const [noNavBar, setNoNavBar] = useState(false);

    useEffect(() => {
        if (session) {
            setNoNavBarElements(false);
            const liElements = document.querySelectorAll('ul.flex li');

            liElements.forEach((li) => {
                li.classList.remove('blur');
                li.classList.remove('pointer-events-none');
            });

            const menuIcon = document.getElementById('menu');

            menuIcon?.classList.remove('blur', 'pointer-events-none');
        } else {
            setNoNavBarElements(true);
            const liElements = document.querySelectorAll('ul.flex li');

            liElements.forEach((li) => {
                li.classList.add('blur');
                li.classList.add('pointer-events-none');
            });

            const menuIcon = document.getElementById('menu');

            menuIcon?.classList.add('blur', 'pointer-events-none');
        }
    }, [session]);

    useEffect(() => {
        if (pathname === '/register' || pathname === '/login' || pathname === '/createAccount') {
            setNoNavBar(true);
            return;
        }
        else {
            setNoNavBar(false);
        }
    }
    , [pathname]);


    return (
        <div>
            {!noNavBar && (
                <div>
                    <nav className="flex justify-between items-center w-full p-4 border-b bg-white">
                    {/* Section for logo and ability to change based off of screen size */}
                    <Link href="https://www.michaelgkoch.com">
                        <div className="flex flex-row items-center">
                            <Image src="/dream_icon.png" className="rounded-lg" width={32} height={32} alt="logo" />
                            <p className="text-black font-semibold text-lg ml-1 w-fit">Dream Oracles</p>
                        </div>
                    </Link>

                    {noNavBarElements && (
                        <div className="md:hidden absolute font-bold underline right-0 p-1 whitespace-nowrap flex flex-col text-right">
                            <a href="/createAccount">Create account</a>
                            <a href="/login">Log In</a>
                        </div>
                    )}
                    {/* Section on the right */}
                    <div className="relative justify-end items-center text-black md:flex hidden">
                        <ul className="flex">
                            <li className={`cursor-pointer mr-4 ${pathname === '/journal' ? 'font-bold' : ''}`}>
                                <Link href="/journal">Journal</Link>
                            </li>
                            <li className={`cursor-pointer mr-4 ${pathname === '/dreams' || pathname === '/dreamDetails' ? 'font-bold' : ''}`}>
                                <Link href="/dreams">Dreams</Link>
                            </li>
                            <li className={`cursor-pointer mr-4 ${pathname === '/oracles' ? 'font-bold' : ''}`}>
                                <Link href="/oracles">Oracles</Link>
                            </li>
                            <li className={`cursor-pointer mr-4 ${pathname === '/pricing' ? 'font-bold' : ''}`}>
                                <Link href="/pricing">Pricing</Link>
                            </li>
                            <li className={`cursor-pointer ${pathname === '/settings' || pathname === '/cancelSubscription' ? 'font-bold' : ''}`}>
                                <Link href="/settings">Settings</Link>
                            </li>
                        </ul>
                        {noNavBarElements && (
                            <div className="absolute font-bold underline flex flex-col text-right">
                                    <a href="/createAccount">Create an account for full features</a>
                                    <a href="/login">Log In</a>
                                </div>
                        )}
                    </div>
                    <div className="md:hidden ml-2 relative">
                        {isOpen ? (
                            <FontAwesomeIcon
                                icon={faX}
                                size="2x"
                                alt="close"
                                onClick={() => setIsOpen(false)}
                            />
                            ) : (
                            <FontAwesomeIcon
                                icon={faListDots}
                                size="2x"
                                id="menu"
                                alt="menu"
                                onClick={() => setIsOpen(true)}
                            />
                        )}
                    </div>
                </nav>
                {isOpen && (
                    <div className="fixed inset-0 top-65 bg-gray-200 z-20 flex justify-between flex-col items-center">
                        <div className="flex-1 p-4">
                            <MenuItems setIsOpen={setIsOpen} pathname={pathname}/>
                        </div>
                    </div>
                )}
            </div>
        )}
        </div>
    );
}

const MenuItems = ({setIsOpen, pathname}) => {

    return (
        <ul className='list-none flex flex-col h-full text-center inset-0 justify-center'>
            <li className={`cursor-pointer text-3xl p-4 ${pathname === '/journal' ? 'font-bold' : ''}`} onClick={() => setIsOpen(false)}>
                <Link href="/journal">Journal</Link>
            </li>
            <li className={`cursor-pointer text-3xl p-4 ${pathname === '/dreams' ? 'font-bold' : ''}`} onClick={() => setIsOpen(false)}>
                <Link href="/dreams">Dreams</Link>
            </li>
            <li className={`cursor-pointer text-3xl p-4 ${pathname === '/oracles' ? 'font-bold' : ''}`} onClick={() => setIsOpen(false)}>
                <Link href="/oracles">Oracles</Link>
            </li>
            <li className={`cursor-pointer text-3xl p-4 ${pathname === '/pricing' ? 'font-bold' : ''}`} onClick={() => setIsOpen(false)}>
                <Link href="/pricing">Pricing</Link>
            </li>
            <li className={`cursor-pointer text-3xl p-4 ${pathname === '/settings' ? 'font-bold' : ''}`} onClick={() => setIsOpen(false)}>
                <Link href="/settings">Settings</Link>
            </li>
      </ul>
    )
}

export default NavBar;