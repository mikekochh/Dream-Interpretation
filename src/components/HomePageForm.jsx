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
            router.push('/interpret');
        }
    }, [session]);

    useEffect(() => {
        const topPosition = document.querySelector('.scrollable-div').getBoundingClientRect().top;
        const dynamicHeight = window.innerHeight - topPosition;
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
                {/* <video autoPlay loop muted playsInline preload='auto' className="cosmic-video">
                    <source src="/cosmic_background.mp4" type="video/mp4" />
                </video> */}
                <div className="place-items-center hidden register-form md:block">
                    <RegisterForm />
                </div>
            </div>
            <div className="text-white text-container hidden text-5xl m-2 md:block">
                <h1 className="md:text-5xl text-3xl pb-2">Dream Oracles</h1>
                <h2 className="text-2xl pb-10">Diverse and powerful dream interpretation</h2>
                {/* <h3 className="text-2xl pb-10">&quot;Dreams shed light on the dim places where reason itself has yet to voyage&quot; - Jordan Peterson</h3> */}
                <p className="text-3xl">Everything you need to interpret your dreams 👇</p>
                <div className="text-lg">
                    <p className="py-2">
                        🖐️ The ONLY dream interpretation tool with <span className="font-bold">5 Dream Oracles</span>, each with their own unique interpretation style,
                        from scientific psychoanalysis to Islamic religious perspectives (Jungian, Freudian, Islamic, and more!).
                    </p>
                    <p className="py-2">
                        <span className="font-bold">📓 Advanced dream journaling</span> for easy logging, secure interpretation 
                        storage, and comprehensive note-taking for all your dream explorations.
                    </p>
                    <p className="py-2 pb-8">
                        <span className="font-bold">🧑‍🤝‍🧑 Join our exclusive telegram community!</span> Make friends, share dreams and interpretations 
                        with others, and dive deep into fascinating conversations about dream interpretation theories with fellow dreamers!
                    </p>
                    <p className="text-3xl">Why should you interpret your dreams ❓</p>
                    <p className="py-2">
                        <span className="font-bold">🌌 Is &apos;Dream Work&apos; the Next Big Mental Health Trend?</span> - Men&apos;s Health Magazine
                    </p>
                    <p className="py-2">
                        <span className="font-bold">🌌 83% of clinical therapists</span> use dream interpretation as part of their practice.
                    </p>
                    <p className="py-2">
                        🌌 Keeping a dream journal helps dream recall, <span className="font-bold">improving creativity, problem-solving, and memory.</span>
                    </p>
                    <p className="py-2">
                        🌌 Dreams provide insights into our emotions and deeper mental state. Understanding our dreams can result in 
                        <span className="font-bold"> improvements in mental health and emotional maturity.</span>
                    </p>
                    <p className="py-2 pb-6">
                        🌌 <span className="font-bold">Deepen your spirituality and connection with yourself</span> by exploring the profound meaning of your dreams.
                    </p>
                    <div className="py-2">
                        <div className="text-center">
                            <span className="text-3xl">👇 Meet our expert Dream Oracles 👇</span> 
                        </div>
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
            <div className="relative md:hidden">
                <div className="register-form-mobile">
                    <RegisterForm />
                </div>
                <div className="scrollable-div text-white z-10 fixed top-72">
                    <div className="overflow-y-auto mx-auto overflow-auto p-2" style={{ height: `${divHeight}px`}}>
                        <h1 className="text-4xl font-bold pb-2">Dream Oracles</h1>
                        <h2 className="text-xl pb-10">Diverse and powerful dream interpretation</h2>
                        <h2 className="text-3xl">Everything you need to interpret your dreams 👇</h2>
                        <div className="text-lg">
                            <p className="py-2">
                                🖐️ The ONLY dream interpretation tool with <span className="font-bold">5 Dream Oracles</span>,
                                each with their own unique interpretation style, from scientific psychoanalysis to Islamic religious 
                                perspectives (Jungian, Freudian, Islamic, and more!).
                            </p>
                            <p className="py-2">
                                <span className="font-bold">📓 Advanced dream journaling</span> for easy logging, secure interpretation
                                storage, and comprehensive note-taking for all your dream explorations.
                            </p>
                            <p className="py-2 pb-8">
                                <span className="font-bold">🧑‍🤝‍🧑 Join our exclusive telegram community!</span> Make friends, share dreams and interpretations
                                with others, and dive deep into fascinating conversations about dream interpretation theories with fellow dreamers!
                            </p>
                            <div className="py-2">
                                <p className="text-3xl">Why should you interpret your dreams ❓</p>
                                <p className="py-2">
                                    <span className="font-bold">🌌 Is &apos;Dream Work&apos; the Next Big Mental Health Trend?</span> - Men&apos;s Health Magazine
                                </p>
                                <p>
                                    🌌 <span>83% of clinical therapists</span> use dream interpretation as part of their practice.
                                </p>
                                <p>
                                    🌌 Keeping a dream journal helps dream recall, which can <span>improve creativity, problem solving, and memory</span>
                                </p>
                                <p>
                                    🌌 Dreams provide insights into our emotions and deeper mental state. Understanding our dreams can 
                                    result in <span>improvements in mental health and emotional maturity</span>
                                </p>
                                <p>
                                    🌌 <span>Deepen your spirituality and connecting with yourself</span> by exploring the profound meaning of your dreams. 
                                </p>
                            </div>
                            <div className="py-2">
                                <div className="text-center">
                                    <span className="font-bold text-2xl">👇 Meet our expert Dream Oracles 👇</span> 
                                </div>
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
        </div>
    )
}