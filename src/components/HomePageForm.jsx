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
    const [divHeight, setDivHeight] = useState(0);
    const router = useRouter();

    useEffect(() => {
        if (session) {
            router.push('/journal');
        }
    }, [session]);

    useEffect(() => {
        const topPosition = document.querySelector('.scrollable-div').getBoundingClientRect().top;
        console.log(topPosition);
        console.log(window.innerHeight);
        const dynamicHeight = window.innerHeight - topPosition - 16;
        console.log(dynamicHeight);
        setDivHeight(dynamicHeight);
    }, []);

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
            <div className="video-container">
                <video autoPlay loop muted playsInline preload='auto' className="cosmic-video">
                    <source src="/cosmic_background.mp4" type="video/mp4" />
                </video>
                <div className="place-items-center hidden register-form md:block">
                    <RegisterForm />
                </div>
            </div>
            <div className="text-white text-container hidden text-5xl m-2">
                <h1 className="md:text-5xl text-3xl pb-2">Dream Oracles</h1>
                <h2 className="text-xl pb-10">Interpret your dreams any way you&apos;d like using the most cutting-edge, intelligent, and diverse dream interpretation tool available.</h2>
                <div className="text-lg">
                    <p className="py-2">
                        <span className="font-bold">🌌 Discover the mysteries of your dreams</span> with diverse interpreations, from 
                        scientific psychoanalysis to Islamic religious perspectives (5 different interpretation styles in total).
                    </p>
                    <p className="py-2">
                        <span className="font-bold">🌌 Capture your nocturnal adventures</span> within our specialized dream journal (easy dream logging, secure interpretation storage,
                        and comprehensive note-taking for all your dream explorations).
                    </p>
                    <p className="py-2">
                        <span className="font-bold">🌌 Support the development of Dream Oracles 😄</span>
                    </p>
                    <div className="py-2">
                        <span className="font-bold">🌌 Unlimited access to our expert Dream Oracles 👇</span> 
                        <div>
                        {oracles.map((oracle) => (
                            <div key={oracle.oracleID} className="character-container">
                            <Image 
                                width={125} 
                                height={125} 
                                src={oracle.oraclePicture}
                                alt={oracle.oracleFullName}
                                className="rounded-3xl oracle-image"
                            />
                                <p className="text-xl font-bold pb-4">{oracle.oracleFullName}</p>
                                <p className="whitespace-pre-line">{oracle.oracleDescriptionShort}</p>
                            </div>
                        ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className="relative">
                <div className="register-form-mobile">
                    <RegisterForm />
                </div>
                <div className="scrollable-div text-white z-10 fixed top-72">
                    <div className="overflow-y-auto mx-auto overflow-auto p-2" style={{ height: `${divHeight}px`}}>
                        <h1 className="text-4xl font-bold pb-2">Dream Oracles</h1>
                        <h2 className="text-xl pb-10">Interpret your dreams any way you&apos;d like using the most cutting-edge, intelligent, and diverse dream interpretation tool available.</h2>
                        <div className="text-lg">
                            <p className="py-2">
                                <span className="font-bold">🌌 Discover the mysteries of your dreams</span> with diverse interpreations, from 
                                scientific psychoanalysis to Islamic religious perspectives (5 different interpretation styles in total).
                            </p>
                            <p className="py-2">
                                <span className="font-bold">🌌 Capture your nocturnal adventures</span> within our specialized dream journal (easy dream logging, secure interpretation storage,
                                and comprehensive note-taking for all your dream explorations).
                            </p>
                            <div className="py-2">
                                <span className="font-bold">🌌 Unlimited access to our expert Dream Oracles 👇</span> 
                                <div>
                                {oracles.map((oracle) => (
                                    <div key={oracle.oracleID} className="character-container">
                                    <Image 
                                        width={125} 
                                        height={125} 
                                        src={oracle.oraclePicture}
                                        alt={oracle.oracleFullName}
                                        className="rounded-3xl oracle-image"
                                    />
                                        <p className="text-xl font-bold pb-4">{oracle.oracleFullName}</p>
                                        <p className="whitespace-pre-line">{oracle.oracleDescriptionShort}</p>
                                    </div>
                                ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="text-white absolute text-5xl m-2">

                </div>
            </div>
        </div>
    )
}