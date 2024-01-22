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
    const [sale, setSale] = useState(null);

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
                const linkText = li.textContent.trim();
                if (linkText !== 'Interpret' && linkText !== 'Blog') {
                    li.classList.add('blur');
                    li.classList.add('pointer-events-none');
                }
            });

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

    useEffect(() => {
        const getSale = async () => {
            const res = await fetch('/api/sale');
            const sale = await res.json();
            setSale(sale[0]);
        }

        getSale();
    }, []);


    return (
        <div>
            {!noNavBar && (
                <div>
                    <nav className="flex justify-between items-center w-full p-4 border-b bg-white">
                    {/* Section for logo and ability to change based off of screen size */}
                    <Link href="https://www.dreamoracles.co">
                        <div className="flex flex-row items-center">
                            <Image src="/dream_icon.png" className="rounded-lg" width={32} height={32} alt="logo" />
                            <p className="text-black font-semibold text-lg ml-1 w-fit">Dream Oracles</p>
                        </div>
                    </Link>
                    {sale && (
                        <div>
                            <div 
                                className="sale-banner font-bold text-xl text-white bg-red-500 p-2 rounded shadow-lg animate-pulse cursor-pointer hidden md:block" 
                                onClick={() => window.location.href = '/pricing'}
                            >
                                {sale.saleDescriptionDesktop}
                            </div>
                            <div 
                                className="sale-banner font-bold text-xl text-white bg-red-500 p-2 rounded shadow-lg animate-pulse cursor-pointer md:hidden" 
                                onClick={() => window.location.href = '/pricing'}
                            >
                                {sale.saleDescriptionMobile}
                            </div>
                        </div>
                    )}

                    {/* Section on the right */}
                    <div className="relative justify-end items-center text-black md:flex hidden">
                        <ul className="flex">
                            <li className={`cursor-pointer mr-4 ${pathname === '/interpret' ? 'font-bold' : ''}`}>
                                <Link href="/interpret">Interpret</Link>
                            </li>
                            <li className={`cursor-pointer mr-4 ${pathname === '/dreamnet' ? 'font-bold' : ''}`}>
                                <Link href="/dreamnet">Dreamnet</Link>
                            </li>
                            <li className={`cursor-pointer mr-4 ${pathname === '/dreams' || pathname === '/dreamDetails' ? 'font-bold' : ''}`}>
                                <Link href="/dreams">Journal</Link>
                            </li>
                            <li className={`cursor-pointer mr-4 ${pathname === '/pricing' ? 'font-bold' : ''}`}>
                                <Link href="/pricing">Shop</Link>
                            </li>
                            <li className={`cursor-pointer mr-4 ${pathname === '/blog' || pathname === '/blogPage' ? 'font-bold' : ''}`}>
                                <Link href="/blog">Blog</Link>
                            </li>
                            <li className={`cursor-pointer ${pathname === '/settings' || pathname === '/cancelSubscription' ? 'font-bold' : ''}`}>
                                <Link href="/settings">Settings</Link>
                            </li>
                        </ul>
                        {noNavBarElements && (
                            <div className="flex flex-row relative justify-center items-center">
                                <div className="font-bold underline flex flex-col text-right">
                                    <a href="/createAccount">Create an account for full features</a>
                                    <a href="/login">Log In</a>
                                </div>
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

    useEffect(() => {

        if (createAccount) {
            const liElementsMobile = document.querySelectorAll('ul.mobile-list li');

            liElementsMobile.forEach((li) => {
                const linkText = li.textContent.trim();
                if (linkText !== 'Interpret' && linkText !== 'Blog') {
                    li.classList.add('blur');
                    li.classList.add('pointer-events-none');
                }
            });
        }

    }, []);

    return (
        <div className="h-full">
            {createAccount && (
                <div className="font-bold text-right underline flex flex-col main-content absolute top-0 right-0 pr-2 text-xl h-fit">
                    <a href="/createAccount">Create an account for full features</a>
                    <a href="/login">Log In</a>
                </div>
            )}
            <ul className='list-none flex flex-col h-full text-center inset-0 justify-center mobile-list' style={{ position: 'relative', zIndex: 1000 }}>
                <li className={`cursor-pointer text-3xl p-4 ${pathname === '/interpret' ? 'font-bold' : ''}`} onClick={() => setIsOpen(false)}>
                    <Link href="/interpret">Interpret</Link>
                </li>
                <li className={`cursor-pointer text-3xl p-4 ${pathname === '/dreamnet' ? 'font-bold' : ''}`} onClick={() => setIsOpen(false)}>
                    <Link href="/dreamnet">Dreamnet</Link>
                </li>
                <li className={`cursor-pointer text-3xl p-4 ${pathname === '/dreams' ? 'font-bold' : ''}`} onClick={() => setIsOpen(false)}>
                    <Link href="/dreams">Journal</Link>
                </li>
                <li className={`cursor-pointer text-3xl p-4 ${pathname === '/pricing' ? 'font-bold' : ''}`} onClick={() => setIsOpen(false)}>
                    <Link href="/pricing">Shop</Link>
                </li>
                <li className={`cursor-pointer text-3xl p-4 ${pathname === '/blog' ? 'font-bold' : ''}`} onClick={() => setIsOpen(false)}>
                    <Link href="/blog">Blog</Link>
                </li>
                <li className={`cursor-pointer text-3xl p-4 ${pathname === '/settings' ? 'font-bold' : ''}`} onClick={() => setIsOpen(false)}>
                    <Link href="/settings">Settings</Link>
                </li>
            </ul>
        </div>
    )
}

export default NavBar;