"use client";
import Image from 'next/image';
import RegisterForm from './RegisterForm';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';


export default function HomePageForm() {

    const [oracles, setOracles] = useState([]);
    const { data: session } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (session) {
            router.push('/journal');
        }
    }, [session]);

    useEffect(() => {

        async function getOracles() {
            const res = await axios.get('/api/oracles');
            let unorderOracles = res.data;
            unorderOracles.sort((a, b) => (a.oracleID > b.oracleID) ? 1 : -1);
            setOracles(unorderOracles);
        }
        getOracles();
    }, []);

    useEffect(() => {
        const video = document.getElementById("cosmic-video");

        if(video) {
            video.play();
        }
    }, []);

    return (
        <div className="home-page">
            <div className="video-container h-96">
                <video autoPlay loop muted playsInline preload='auto' className="cosmic-video h-96 rounded-3xl p-4">
                    <source src="/cosmic_background.mp4" type="video/mp4" />
                </video>
                <div className="text-white text-container text-5xl md:pr-52 p-4">
                    <h1 className="md:text-5xl text-3xl pb-2">Dream Oracles</h1>
                    <h2 className="md:text-3xl text-xl">Interpret your dreams using the most cutting-edge, intelligent, and diverse dream interpretation tool available.</h2>
                </div>
                <div className="place-items-center register-form hidden md:block">
                    <RegisterForm />
                </div>
                <div className="register-form md:hidden">
                    <button className="text-white text-3xl rounded-2xl p-2 mt-5 ml-5 bg-blue-500 hover:bg-blue-700" onClick={() => window.location.href = "/register"}>Sign Up</button>
                </div>
            </div>
            <div className="text-white text-3xl md:text-5xl p-4 text-center">
                Meet the crew!
                {oracles.map((oracle) => (
                    <div key={oracle.oracleID} className="character-container">
                    <Image 
                        width={320} 
                        height={320} 
                        src={oracle.oraclePicture}
                        alt={oracle.oracleFullName}
                        className="rounded-3xl oracle-image"
                    />
                        <p className="pb-4">{oracle.oracleFullName}</p>
                        <p className="text-2xl whitespace-pre-line">{oracle.oracleDescription}</p>
                    </div>
                ))}
                <div className="md:pr-20 md:pl-20">
                    <p className="p-3">
                        And many more oracles to come in the future!
                    </p>
                    <p className="md:p-3 pt-10 text-xl md:text-3xl">
                        Each Oracle provides a unique perspective that helps you understand your dreams in a new light. We recommend asking 
                        each of them what they think about your dream to gain a more comprehensive understanding of your dream&apos;s meaning as well
                        as seeing which character&apos;s style resonates with you the most. Sometimes, Jung might hit it right on the nose, while other times
                        Luna might bring up a point that strikes a cosmic cord in your soul. 
                    </p>
                    <p className="md:p-3 pt-10 text-xl md:text-3xl">
                        Whether you are interested in self-reflection, self-development, spirituality, psychology, philosophical thinking 
                        about human nature, or whatever brings you to dig deeper into your dreams, we got it all at Dream Oracles. Register 
                        now to speak to our Oracles and start your journey of self-discovery and enlightenment!
                    </p>
                </div>
            </div>
            <div className="grid place-items-center pb-40 md:pb-10">
                <RegisterForm />
            </div>
        </div>


    )
}