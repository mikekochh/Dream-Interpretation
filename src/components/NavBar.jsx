"use client";

import React, { useEffect, useState, useContext } from "react";
import Link from 'next/link';
import Image from 'next/image';
import { faX, faListDots } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { UserContext } from "@/context/UserContext";
import { useRouter } from "next/navigation";

const NavBar = () => {

    const { user, userLoading } = useContext(UserContext) || {};
    const router = useRouter();

    const [isOpen, setIsOpen] = useState(false);
    const { data: session } = useSession();
    const pathname = usePathname();
    const [noNavBar, setNoNavBar] = useState(false);

    const getPageType = (pathname) => {
        if (pathname === '/') {
          return PAGE_TYPE_HOME;
        } else if (pathname.startsWith('/create-account')) {
          return PAGE_TYPE_CREATE_ACCOUNT;
        } else if (pathname.startsWith('/add-project')) {
          return PAGE_TYPE_ADD_PROJECT;
        } else if (pathname.startsWith('/profile')) {
          return PAGE_TYPE_PROFILE;
        } else if (pathname.startsWith('/project-details')) {
          return PAGE_TYPE_PROJECT_DETAILS;
        } else if (pathname.startsWith('/projects')) {
          return PAGE_TYPE_SEARCH_PROJECTS;
        } else if (pathname.startsWith('/messages')) {
          return PAGE_TYPE_MESSAGES;
        } else {
          return null; // Default or undefined for untracked paths
        }
      };

    useEffect(() => {
        if (!userLoading) {
            if (!user) {
                setNoNavBar(true);
                return;
            }
            else {
                setNoNavBar(false);
            }
        }
    }, [userLoading]);

    return (
        <div className="golden-ratio-2">
            <div>
                <nav className="flex justify-between items-center w-full p-4">
                <Link href="https://www.dreamoracles.co">
                    <div className="flex flex-row items-center">
                        <Image src="/dream_icon.webp" className="rounded-lg border-gold-small" width={32} height={32} alt="logo" />
                        <p className="text-white font-semibold ml-2 w-fit hidden md:block">Dream Oracles</p>
                    </div>
                </Link>

                {noNavBar ? (
                    <div>
                        <button 
                            className="secondary-button-mobile px-3 py-1 text-sm" 
                            onClick={() => router.push('/login')}    
                        >
                            Login
                        </button>
                        <button 
                            className="start-button-small px-3 py-1 text-sm" 
                            onClick={() => router.push('/register')}    
                        >
                            Sign Up Free
                        </button>
                    </div>
                ) : (
                    <div>
                        {/* Section on the right */}
                        <div className="relative justify-end items-center text-white md:flex hidden">
                            <ul className="flex">
                                <li className={`cursor-pointer mr-4 ${pathname === '/interpret' ? 'font-bold' : ''}`}>
                                    <Link href="/interpret">Interpret</Link>
                                </li>
                                <li className={`cursor-pointer mr-4 ${pathname === '/dreams' || pathname === '/dreamDetails' ? 'font-bold' : ''}`}>
                                    <Link href="/dreams">Journal</Link>
                                </li>
                                <li className={`cursor-pointer mr-4 ${pathname === '/dream-stream' ? 'font-bold' : ''}`}>
                                    <Link href="/dream-stream">Stream</Link>
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
                    </div>
                )}
            </nav>
            {isOpen && (
                <div className="mobile-nav-background fixed inset-0 top-65 z-20 flex justify-between flex-col items-center">
                    <div className="flex-1 p-4">
                        <MenuItems setIsOpen={setIsOpen} pathname={pathname} createAccount={session === null}/>
                    </div>
                </div>
            )}
        </div>
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
                <li className={`cursor-pointer p-4 ${pathname === '/dream-stream' ? 'font-bold' : ''}`} onClick={() => setIsOpen(false)}>
                    <Link href="/dream-stream">Stream</Link>
                </li>
                <li className={`cursor-pointer p-4 ${pathname === '/library' ? 'font-bold' : ''}`} onClick={() => setIsOpen(false)}>
                    <Link href="/library">Library</Link>
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