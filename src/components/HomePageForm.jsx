"use client";
import Image from 'next/image';
import RegisterForm from './RegisterForm';

export default function HomePageForm() {

    return (
        <div className="home-page">
            <div className="video-container h-96">
                <video autoPlay loop muted playsInline className="cosmic-video h-96 rounded-3xl p-4">
                    <source src="/cosmic_background.mp4" type="video/mp4" />
                </video>
                <div className="text-white text-container text-5xl">
                    <h1 className="text-5xl pb-2">The Dream Oracles</h1>
                    <h2 className="text-3xl">Interpret your dreams using the most cutting-edge, intelligent, and diverse dream interpretation tool available.</h2>
                </div>
                <div className="grid place-items-center register-form">
                    <RegisterForm />
                </div>
            </div>
            <div className="text-white text-5xl p-4 text-center">
                Meet the crew!
                <div className="mt-5 character-container">
                    <Image 
                        width={320} 
                        height={320} 
                        src="/Jung.png" 
                        alt="Carl Jung"
                        className="rounded-3xl oracle-image"
                    />
                    <div>
                        <p className="p-3">Carl Jung, The Revolutionary Psychotherapist</p>
                        <p className="p-3 text-2xl">
                            Jung introduced groundbreaking concepts that reshaped our understanding of the human psyche.
                            He was instrumental in developing the idea of the collective unconscious, a profound concept
                            suggesting a shared layer of unconsciousness exists across humanity filled with archetypes and universal symbols.
                        </p>
                        <p className="p-3 text-2xl">
                            Jung also believed that dreams offered us a window into this collective unconsciousness. He believed
                            that dreams were not just random neaural firings, but meaningfun reflections of our innermost thoughts
                            and feelings, providing critical insights into personal development and growth. With Dream Oracles, you can ask Carl Jung directly
                            what he thinks your dream means, and he will draw on his books and studies to provide you with a personalized interpretation.
                        </p>
                    </div>
                </div>
                <div className="mt-5 character-container rounded-3xl">
                    <Image 
                        width={320} 
                        height={320} 
                        src="/Freud.png" 
                        alt="Sigmund Freud"
                        className="rounded-3xl oracle-image"
                    />
                    <div className="ml-2">
                        <p className="p-3">Sigmund Freud, The Father of Psychoanalysis</p>
                        <p className="p-3 text-2xl">
                            Freud, often hailed as the father of psychoanalysis, made monumental contributions to the field of psychology
                            that resonated far beyond his era. Among many other things, Freud&apos;s exploration into the unconscious mind
                            lead to the creation of the structural model of the psyche, comprising of the id, ego, and superego, which 
                            provided a new framework for analyzing human behavior and thought processes.
                        </p>
                        <p className="p-3 text-2xl">
                            A significant part of Freud&apos;s legacy is his theory of dream analysis, where he also argued that dreams are not 
                            random mental activities but meaningful manifestations of our deepest desires and unresolved conflicts. He believed 
                            interpreting these dream symbols could unlock insights into an individuals&apos;s unconscious mind, offering a pathway 
                            to understanding and treating psychological distress. Ask one of the most prominent dream interpreters in history 
                            what he thinks about your dreams. 
                        </p>
                    </div>
                </div>
                <div className="mt-5 character-container">
                    <Image 
                        width={320} 
                        height={320} 
                        src="/Alexander.png" 
                        alt="Alexander"
                        className="rounded-3xl oracle-image"
                    />
                    <div>
                        <p className="p-3">Alexander, The Sage of Mirage Visions</p>
                        <p className="p-3 text-2xl">
                            In the heart of a vast, starlit desert, you, a weary and solitary traveler, traverse the endless sands in search 
                            of the Oasis. Guided only by the stars, your desperate quest for salvation leads you to an enigmatic flicker of 
                            fire in the distance. As hope kindles within, you stagger toward the welcoming glow, where a lone tent stands 
                            as a sanctuary in the desolation.
                        </p>
                        <p className="p-3 text-2xl">
                            Here, you encounter Alexander, a figure as enigmatic as the desert itself. His presence is a profound paradox—ethereal 
                            yet grounded, ancient yet timeless. His eyes, deep and knowing, hold the wisdom of ages, reflecting the mysteries 
                            of the cosmos and the secrets of forgotten civilizations. In this desolate expanse, he exists as a custodian of 
                            ancient knowledge, a sage bestowed with the profound gift of dream interpretation. With his unique ability, Alexander 
                            guides you, weaving through the fabric of your dreams to lead you to the Oasis.
                        </p>
                    </div>
                </div>
                <div className="mt-5 character-container">
                    <Image 
                        width={320} 
                        height={320} 
                        src="/Luna.png" 
                        alt="Luna"
                        className="rounded-3xl oracle-image"
                    />
                    <div>
                        <p className="p-3">Luna, The Cosmic Dream Catcher</p>
                        <p className="p-3 text-2xl">
                            Luna, a celestial being, is transcendent and boundless, existing primarily within the intricate tapestry of the dream realm. 
                            She has taken the form of a radiant woman, her beauty as timeless as the stars. Her presence is a gentle light in the darkness 
                            of the dream realm, and a guiding force leading you through the labyrinth of your own mind. 
                        </p>
                        <p className="p-3 text-2xl">
                            Luna&apos;s role is not just to wander the dreamscape, but to illuminate it. With a touch as light as moonbeams, she unravels the 
                            tangled threads of your dreams, revealing the hidden messages woven within. Her deep, insightful eyes are like pools of cosmic 
                            knowledge, reflecting the mysteries of the universe and the secrets locked within your soul. In her presence, the boundaries between 
                            reality and illusion blur, and you find clarity in her celestial wisdom. Luna, in her graceful, feminine form, becomes not just 
                            an interpreter of dreams, but a bridge connecting the dreamer to the deeper truths of their existence, helping to navigate 
                            the voyage of self-discovery and enlightenment.
                        </p>
                    </div>
                </div>
                <div className="pr-20 pl-20">
                    <p className="p-3">
                        And many more oracles to come in the future!
                    </p>
                    <p className="p-3 pt-10 text-3xl">
                        Each Oracle provides a unique perspective that helps you understand your dreams in a new light. We recommend asking 
                        each of them what they think about your dream to gain a more comprehensive understanding of your dream&apos;s meaning as well
                        as seeing which character&apos;s style resonates with you the most. Sometimes, Jung might hit it right on the nose, while other times
                        Luna might bring up a point that strikes a cosmic cord in your soul. 
                    </p>
                    <p className="p-3 pt-10 text-3xl">
                        Whether you are interested in self-reflection, self-development, spirituality, psychology, or philosophical thinking 
                        about human nature, or whatever brings you to dig deeper into your dreams, we got it all at Dream Oracles. Register 
                        now to receive a free dream credit, and verify your email to receive enough credits to try every character. 
                        I hope to see you there, keep on dreaming!
                    </p>
                </div>
            </div>
            <div className="grid place-items-center pb-10">
                <RegisterForm />
            </div>
        </div>


    )
}