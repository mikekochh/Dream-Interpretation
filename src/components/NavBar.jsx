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
    const { data: session } = useSession();
    const pathname = usePathname();
    const [noNavBar, setNoNavBar] = useState(false);
    const [sale, setSale] = useState(null);

    useEffect(() => {
        if (pathname === '/register' || pathname === '/login' || pathname === '/register') {
            setNoNavBar(true);
            return;
        }
        else {
            setNoNavBar(false);
        }
    }
    , [pathname]);

    useEffect(() => {
        const getSale = async () => {
            const res = await fetch('/api/sale');
            const sale = await res.json();
            setSale(sale[0]);
        }

        getSale();
    }, []);


    return (
        <div className="golden-ratio-2">
            {!noNavBar && (
                <div>
                    <nav className="flex justify-between items-center w-full p-4">
                    <Link href="https://www.dreamoracles.co">
                        <div className="flex flex-row items-center">
                            <Image src="/dream_icon.webp" className="rounded-lg border-gold-small" width={32} height={32} alt="logo" />
                            <p className="text-white font-semibold ml-2 w-fit">Dream Oracles</p>
                        </div>
                    </Link>
                    {sale && (
                        <div>
                            <div 
                                className="sale-banner font-bold text-white bg-red-500 p-2 rounded shadow-lg animate-pulse cursor-pointer hidden md:block" 
                                onClick={() => window.location.href = '/pricing'}
                            >
                                {sale.saleDescriptionDesktop}
                            </div>
                            <div 
                                className="sale-banner font-bold text-white bg-red-500 p-2 rounded shadow-lg animate-pulse cursor-pointer md:hidden" 
                                onClick={() => window.location.href = '/pricing'}
                            >
                                {sale.saleDescriptionMobile}
                            </div>
                        </div>
                    )}

                    {/* Section on the right */}
                    <div className="relative justify-end items-center text-white md:flex hidden">
                        <ul className="flex">
                            <li className={`cursor-pointer mr-4 ${pathname === '/interpret' ? 'font-bold' : ''}`}>
                                <Link href="/interpret">Interpret</Link>
                            </li>
                            <li className={`cursor-pointer mr-4 ${pathname === '/dreams' || pathname === '/dreamDetails' ? 'font-bold' : ''}`}>
                                <Link href="/dreams">Journal</Link>
                            </li>
                            <li className={`cursor-pointer mr-4 ${pathname === '/library' ? 'font-bold' : ''}`}>
                                <Link href="/library">Library</Link>
                            </li>
                            <li className={`cursor-pointer ${pathname === '/settings' || pathname === '/cancelSubscription' ? 'font-bold' : ''}`}>
                                <Link href="/settings">Profile</Link>
                            </li>
                        </ul>
                    </div>
                    <div className="md:hidden ml-2 relative">
                        {isOpen ? (
                            <FontAwesomeIcon
                                icon={faX}
                                alt="close"
                                className="text-white"
                                onClick={() => setIsOpen(false)}
                            />
                            ) : (
                            <FontAwesomeIcon
                                icon={faListDots}
                                id="menu"
                                size="lg"
                                alt="menu"
                                className="text-white"
                                onClick={() => setIsOpen(true)}
                            />
                        )}
                    </div>
                </nav>
                {isOpen && (
                    <div className="mobile-nav-background fixed inset-0 top-65 z-20 flex justify-between flex-col items-center">
                        <div className="flex-1 p-4">
                            <MenuItems setIsOpen={setIsOpen} pathname={pathname} createAccount={session === null}/>
                        </div>
                    </div>
                )}
            </div>
        )}
        </div>
    );
}

const MenuItems = ({setIsOpen, pathname, createAccount}) => {

    return (
        <div className="h-full golden-ratio-3 text-white">
            <ul className='list-none flex flex-col h-full text-center inset-0 justify-center mobile-list' style={{ position: 'relative', zIndex: 1000 }}>
                <li className={`cursor-pointer p-4 ${pathname === '/interpret' ? 'font-bold' : ''}`} onClick={() => setIsOpen(false)}>
                    <Link href="/interpret">Interpret</Link>
                </li>
                <li className={`cursor-pointer p-4 ${pathname === '/dreams' || pathname === '/dreamDetails' ? 'font-bold' : ''}`} onClick={() => setIsOpen(false)}>
                    <Link href="/dreams">Journal</Link>
                </li>
                <li className={`cursor-pointer p-4 ${pathname === '/settings' ? 'font-bold' : ''}`} onClick={() => setIsOpen(false)}>
                    <Link href="/settings">Profile</Link>
                </li>
                {createAccount && (
                    <>
                        <li className={`cursor-pointer p-4 ${pathname === '/register' ? 'font-bold' : ''}`} onClick={() => setIsOpen(false)}>
                            <Link href="/register">Create Account</Link>
                        </li>
                        <li className={`cursor-pointer p-4 ${pathname === '/login' ? 'font-bold' : ''}`} onClick={() => setIsOpen(false)}>
                            <Link href="/login">Login</Link>
                        </li>
                    </>
                )}
            </ul>
        </div>
    )
}

export default NavBar;