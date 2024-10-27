"use client";
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { SIGN_UP_TYPE_E_BOOK } from "@/types/signUpTypes";
import { signIn } from 'next-auth/react';
import { UserContext } from '@/context/UserContext';
import { PAGE_E_BOOK } from '@/types/pageTypes';
import { useRouter } from 'next/navigation';
import LoadingComponent from './LoadingComponent';

export default function EBookForm() {

    const { user, setUserData, userLoading } = useContext(UserContext) || {};

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [countedView, setCountedView] = useState(false);
    const [showSentEmailMessage, setShowSentEmailMessage] = useState(false);

    const router = useRouter();

    useEffect(() => {
        const addView = async () => {
            const referrer = document.referrer;
            const isFromInstagram = referrer.includes('instagram.com');

            if (window.location.hostname !== 'localhost') {
                await axios.post('/api/views/addView', {
                    pageID: PAGE_E_BOOK,
                    userID: user?._id,
                    isFromInstagram
                });
                setCountedView(true);
            }
        }
    
        if (!userLoading && !countedView) {
            addView();
        }
    }, [userLoading]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            setError(""); // Clear any previous errors
    
            // Email validation regex
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
            if (!name) {
                setError("Please enter a name.");
                return;
            }
            if (!email) {
                setError("Please enter an email.");
                return;
            }
            if (!emailPattern.test(email)) {
                setError("Please enter a valid email address.");
                return;
            }

            const emailLower = email.toLowerCase();

            const res = await fetch(`api/user/${emailLower}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (res.ok) {
                const resActivated = await fetch(`api/user/activated/${emailLower}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                const data = await resActivated.json();

                if (resActivated.ok) {
                    if (data.isActivated) {
                        const resSignIn = await signIn("credentials", {
                            email,
                            password: 'password',
                            redirect: false
                        });
                        setUserData();
                        return;
                    }
                    else {
                        await axios.post('/api/sendEBookEmail', { email, name });
                        setShowSentEmailMessage(true);
                        localStorage.setItem('ebook', true);
                        return;
                    }
                }
            } else {
                const responseRegister = await axios.post('api/register', {
                    name,
                    email,
                    signUpTypeID: SIGN_UP_TYPE_E_BOOK 
                });
    
                if (responseRegister.status === 200) {
                    await axios.post('/api/sendEBookEmail', { email, name });
                    setShowSentEmailMessage(true);
                    localStorage.setItem('ebook', true);
                }
            }
            setLoading(false);
        } catch (error) {
            console.log("There was an error signing user up for the ebook: ", error);
            setError("Oops! Something went wrong while processing your request. Please try again in a few moments.");
            setLoading(false);
        }
    };    

    if (userLoading) {
        return (
            <LoadingComponent loadingText={"Preparing eBook"} />
        )
    }

    if (user) {
        return (
            <div className="main-content text-white md:w-3/4 md:mx-auto mx-4 hide-scrollbar">
                <h1 className="text-center font-semibold golden-ratio-3">How To Interpret Dreams</h1>
                <h2 className="text-center golden-ratio-2 italic mb-4">An easy and practical guide for understanding and interpreting your dreams</h2>
                <div className="text-center mb-6">
                    <a
                        href="/DreamEBook.pdf"
                        download
                        className="ml-4 inline-block bg-green-500 text-white font-medium py-2 px-4 rounded hover:bg-green-700 transition"
                    >
                        Download PDF
                    </a>
                </div>
                <div className=''>
                    <p className="ebook-text">
                        Everyone I know is curious about their dreams. Some say that dreams are just random brain activity, but I think 
                        most people don&apos;t buy that. We all intuitively understand that dreams are more than just random occurrences, but 
                        they can be significant events and experiences that are guiding forces in your life. Otherwise, why would you be 
                        here wanting to learn how to understand them?
                    </p>
                    <p className="ebook-text">
                        In this e-book, we will be discussing everything pertaining to understanding your dreams. First, we will start by exploring 
                        what dreams actually are, then we will discuss the different type of symbols that can appear in your dreams, and then 
                        finally we will talk about how to interpret these symbols properly.
                    </p>
                    <p className="ebook-text">
                        Let&apos;s start by talking about the two most important things to understand about dreams.
                    </p>
                    <h2 className="font-semibold golden-ratio-2">Dreams Are Benevolent and Guiding Forces</h2>
                    <p className="ebook-text">
                        This is the most important thing to take away from this book. Dreams are there to help you solve the problems that you 
                        are dealing with in your waking life and to help you understand the universe you are a part of. Your underlying beliefs 
                        are extremely powerful and are what determines what you get out of your dreams. But this goes much deeper than your 
                        beliefs on dreams.
                    </p>
                    <p className="ebook-text">
                        Dreams are a part of nature, a part of the universe, a part of God, a part of that higher order. If you believe that 
                        there is a benevolent, higher order to the universe (aka, God), then your dreams will be a reflection of that. Your 
                        dreams will draw from this belief, and be a benevolent force in your life, helping you grow as a person.
                    </p>
                    <p className="ebook-text">
                        Alternatively, if you think the universe is completely random, there is no meaning to any of this, there is no benevolent 
                        higher order, we are just monkeys floating on a random rock with no purpose, then your dreams will also be a reflection 
                        of that. This is why so many people today write off dreams as just random, and also why so many modern people have 
                        spiritual and psychological problems, because us modern humans have lost touch with this benevolent higher order of the universe.
                    </p>
                    <p className="ebook-text">
                        It is only when you believe in the benevolent nature of the universe, whether that is through religion, God, or whatever you 
                        believe, that is when you tune into the proper frequency. Think about it like a radio. You only get the message if you are tuned 
                        into the right frequency, otherwise, it&apos;s just random static. Once you&apos;re on that frequency, that is when your dreams will become 
                        a powerful guiding force in your life, providing profound answers and solutions to your waking problems. It all starts with your 
                        beliefs, and if they aren&apos;t oriented correctly, you&apos;re never going to get anything out of this.
                    </p>
                    <h2 className="font-semibold golden-ratio-2">Dreams Speak to Us Through Symbolism</h2>
                    <p className="ebook-text">
                        The second most important thing that you must understand about dreams is that they do not speak to us in the same language that 
                        we speak to each other. They speak in an abstract language of symbolism. It is like how a piece of art communicates with you. 
                        There&apos;s no words, and even if there are words, the meaning of the piece of art is not being directly communicated to you through 
                        the words. Instead, there is a higher, more abstract idea or emotion that the piece of art is pointing at.
                    </p>
                    <p className="ebook-text">
                        This is the language that our unconscious mind speaks to us in. The unconscious mind is the part of our mind that is connected 
                        to that higher power. The unconscious mind is the part of our mind that guides us through inner wisdom and intuition, often 
                        revealing truths that our conscious mind may overlook or not want to be aware of.
                    </p>
                    <p className="ebook-text">
                        Part of the job of the unconscious mind is to alert the conscious mind when it sees problems coming that the conscious mind 
                        has not become aware of, or offer alternate solutions to problems that the conscious mind has not thought of. The way that 
                        the unconscious mind communicates with the conscious mind is through dreams and symbolism.
                    </p>
                    <p className="ebook-text">
                        If you&apos;re new to this, this might be a very complex and abstract idea that can be hard to wrap your head around. Let&apos;s go 
                        through an example to help you better understand what I am trying to get at.
                    </p>
                    <p className="ebook-text">
                        Imagine you&apos;re dreaming that you&apos;re back in school, sitting at your desk, about to take an important exam. You look around 
                        and see that everyone is working hard on their exam, but when you look down at your test paper, you realize that you have no 
                        idea what the questions mean. It&apos;s like they&apos;re written in a foreign language. You feel time is running out, and you feel a 
                        wave of panic as you try to make sense of the exam. But then, you pull out a piece of blank white paper from your pocket. 
                        Suddenly, a great relief comes over you. The blank piece of paper becomes your new exam, and you begin to fill in the new 
                        piece of paper.
                    </p>
                    <p className="ebook-text">
                        On the surface, this dream might seem strange. Something like this would never happen in real life, and yet, this is what 
                        our unconscious mind presents us. Now this dream isn&apos;t really about school or an exam. Instead, it&apos;s the unconscious mind&apos;s 
                        way of reflecting on the dreamer&apos;s current emotional state, and it is offering potential solutions to solve this problem.
                    </p>
                    <p className="ebook-text">
                        The dreamer is clearly stressed out about some event coming in their life. They feel unprepared, and this dream starts 
                        by communicating and reflecting this to the conscious mind. Then, a solution is offered. The unconscious mind suggests 
                        drawing on their own inner wisdom (pulling the paper out of their own pocket), using their own inner power to take time 
                        to reset (using this as the exam instead), and approach the situation with a fresh perspective (blank paper). The overarching 
                        theme of the dream is dealing with feelings of stress and being unprepared by trusting in yourself, and allowing yourself to 
                        take a step back and move at your own pace.
                    </p>
                    <p className="ebook-text">
                        Now, every symbol that appears in your dreams draws its symbolic definition from two sources, a universal source and an 
                        individual source. Let me quickly break down what each of these sources are, and then we can get into how to interpret 
                        these symbols to get real value from your dreams.
                    </p>
                    <h2 className="font-semibold golden-ratio-2">Universal Source</h2>
                    <p className="ebook-text">
                        You can imagine the universal source as a shared library that all humans share and are able to draw from. If you&apos;re familiar 
                        with Carl Jung, this is the collective unconscious. There are certain experiences that we all share as humans, which allows 
                        us to use the same symbolic definition for symbols that appear in your dreams. This is why something like the Mona Lisa is 
                        so popular, because something about that piece calls upon something inside all of us. We are all humans and we are all living 
                        life, so we all run into the same symbols and problems in our lives.
                    </p>
                    <p className="ebook-text">
                        Let&apos;s go back to the last example of taking an exam in school. We have all been in that situation where we are stressed out 
                        and feel unprepared for an exam, so our unconscious is able to draw upon that experience to communicate feelings of stress 
                        or unpreparedness in your life, and that symbol will work for most people.
                    </p>
                    <h2 className="font-semibold golden-ratio-2">Individual Source</h2>
                    <p className="ebook-text">
                        Alternatively, the individual source is more related to your own personal experience. Yes, we are all humans and we share a 
                        lot in how we experience life, but we also have our personal experiences that make us who we are, that allow us to differ from the norm.
                    </p>
                    <p className="ebook-text">
                        Let&apos;s say you had a dream about an elevator. Depending on what the elevator is doing, universally it can symbolize transitions and 
                        progression in your life. But, if you are deathly terrified of elevators, then an elevator appearing in your dream will be 
                        complete different then an elevator appearing in the average person&apos;s dream. You need to be conscious of these type of symbols 
                        appearing in your dreams, as understanding an individual symbol can lead to a very rich interpretation that can provide incredible 
                        value for you.
                    </p>
                    <p className="ebook-text">
                        These are the two types of symbols that you can run into in your dreams. Now that we&apos;ve discussed the type of symbols that you can 
                        run into in your dreams, let&apos;s get into the real reason why you are here, how do we interpret these symbols? How do we learn to 
                        speak the language of the unconscious, the language of symbolism?
                    </p>
                    <h2 className="font-semibold golden-ratio-2">How To Interpret Dreams?</h2>
                    <p className="ebook-text">
                        There are two main objectives to interpreting dreams. The first part is understanding each symbol in the dream, and then the next 
                        part is putting it all together. The basic question you should be asking yourself when interpreting your dreams is why did these 
                        symbols come into my dream in the way that they did?
                    </p>
                    <p className="ebook-text">
                        There is a lot of reflection that needs to be done when interpreting dreams. What does this symbol mean to me? How does this make 
                        me feel? What am I going through in my waking life currently that relates to this dream? These are questions you need to keep 
                        in mind as you are going through your dream, and these questions need to be asked for all symbols that appear in your dream. 
                        And at the end, you need to tie it all together. Why did all of these symbols appear in my dream? What do these symbols share in 
                        common? What is this dream pointing at in my life? These are questions that you can ask yourself as you go through the process of 
                        interpreting your dream. It is smart to keep these questions in the back of your mind as you work through your dream, as this will 
                        prime your brain to find solutions to these answers.
                    </p>
                    <p className="ebook-text">
                        For most people, this process is not intuitive and it takes time to learn how to interpret symbols on your own. Even me, someone who 
                        has been interpreting dreams for multiple years, I still rely on tools to help me in the process of reflecting on the symbols in my 
                        dreams. Although this process can totally be done on your own, I find that having tools to support you in your interpretation to be 
                        helpful. Here are some tools that I have used in my journey of understanding my dreams, and then my recommendation for the best tool 
                        for helping you interpret your dreams.
                    </p>
                    <h2 className="font-semibold golden-ratio-2">Support Tools When Interpreting Dreams</h2>
                    <p className="ebook-text">
                        I want to make a disclaimer before I start to talk about dream interpretation tools: no one can tell you what your dream means. 
                        Google can&apos;t tell you what your dream means, a random person on reddit can&apos;t tell you what your dream means, ChatGPT can&apos;t tell 
                        you what your dream means, and our services at Dream Oracles can&apos;t tell you what your dream means. Even a great therapist can&apos;t 
                        tell you what your dream means. A great therapist will tell you that they are not there to interpret your dream, but to help you 
                        interpret the dream yourself. These tools are here to support you in your own reflective process of interpreting your dreams.
                    </p>
                    <p className="ebook-text">
                        With that being said, let&apos;s start with where I started, Google. I would have a dream, and one by one I would google each symbol 
                        in the dream and then try to connect the dots between all of the different symbolic interpretations that I discovered. This can 
                        work, but there are a couple of problems using this tool for interpreting the symbols. For one, you will find yourself in dream 
                        books or on forums where some random person is providing a singular definition for a symbol that was in your dream. Symbols can 
                        have multiple interpretations, and some dream books only provide short and one-dimensional interpretations to symbols. A snake 
                        in a dream can represent hidden fears or threats in your life, but it can also mean transformation and renewal. I found that 
                        dream books often didn&apos;t give all of the different interpretations of symbols, and I found myself searching multiple forums just 
                        to get an interpretation that resonated with me and made sense.
                    </p>
                    <p className="ebook-text">
                        The second problem with this approach is you are providing zero context about the rest of the dream or your life. You never 
                        just dream about a snake. Dreams are often more like “I was with my dad in a Ferrari driving through the woods at night and 
                        then a snake came out of the steering wheel and attacked me.”. The context of the rest of the dream is important, and it is 
                        impossible for these Google sources to understand the context of your dream. Also, what is going on in your life that caused 
                        this dream to happen? What is your relationship with your dad like? There are so many details from your real life that are 
                        necessary to know when interpreting a dream that Google cannot possibly know.
                    </p>
                    <p className="ebook-text">
                        Then comes AI. AI is able to solve some of the problems that we run into when interpreting dreams symbols using Google. Now, 
                        you are able to tell the AI the entire dream you had, and it is able to break down each symbol within the context of your 
                        entire dream. But even with this approach, just putting your dream into chatGPT is great, and is definitely a step up from 
                        googling your dreams, there are still some pieces missing. ChatGPT doesn&apos;t know who you are. Let&apos;s go back to this dream we 
                        had with the snake attacking us while we were driving with our dad. ChatGPT doesn&apos;t know your relationship with your dad. 
                        What if you have a pet snake? What&apos;s your relationship with a Ferrari? Do you own one? Do you recognize where you were in 
                        the dream? These are all important details that need to be considered when interpreting your dreams, and things that ChatGPT 
                        cannot possibly know.
                    </p>
                    <p className="ebook-text">
                        This is why I built Dream Oracles, to create a dream interpretation tool that provides the best support that you could possibly 
                        have when interpreting your dreams. I have taken the process that I use on myself, the process that therapists use in their 
                        practice, and have turned it into a website. How does it work?
                    </p>
                    <p className="ebook-text">
                        First, you start by telling us the dream you had last night. The program will then begin to curate questions that it has about 
                        your dream, to better understand who you are, anything you might be going through in life currently, and any other details 
                        about the dream the AI should know before providing an interpretation. Let&apos;s go back to our dream from before about the snake 
                        attacking us, there are many questions that come to mind when looking at this dream. What is your relationship with your father 
                        like? How did you feel during the dream? What does a Ferrari represent to you? How did you feel when the snake attacked you? 
                        What did the snake look like? Are there any significant events or challenges in your waking life that you are currently going 
                        through? These are all questions that need to be answered to properly understand this dream. These questions are designed to 
                        help our AI models understand your situation better, but they are also there to get you thinking about what your dream means.
                    </p>
                    <p className="ebook-text">
                        Then, once we are done collecting all the details we need, our AI models process all of the details and spit out an interpretation. 
                        At this point, you might have a good idea as to what your dream might mean, or maybe you don&apos;t. Either way, you can read your 
                        interpretation and it should resonate with you. This again goes back to my last point, we are not trying to tell you what your 
                        dream means, but we are trying to help you understand what your dream might mean. If the interpretation does not resonate with 
                        you, or you came to some interpretation yourself while you were answering the questions and the final one we gave you does not 
                        match, always trust yourself. We are only here to help you, and if you found the answer, great. Stick with that. But it is always 
                        nice to see the final interpretation to see what the AI model has to see. There might be details that you missed that can further 
                        enrich your interpretation.
                    </p>
                    <h2 className="font-semibold golden-ratio-2">Bonus Tip: Keep a Dream Journal</h2>
                    <p className="ebook-text">
                        Something I wanted to mention that is vitally important is keeping a dream journal. You will not be able to remember all of the 
                        details of the dreams that you have at night, but keeping a dream journal will allow you to keep track of the dreams you are 
                        having without having to keep them in your brain. Also, the process of writing your dreams down helps you remember them more. 
                        So, the more you use a dream journal, the more details you will remember about your dreams, which will give you more information 
                        to help you interpret your dreams. You can use anything you&apos;d like for a dream journal, notepad, iPhone notes, piece of paper, but 
                        at Dream Oracles, we also manage a dream journal for you, keeping track of all your dreams, interpretations, and any other details 
                        about your dream.
                    </p>
                    <h2 className="font-semibold golden-ratio-2">Conclusion</h2>
                    <p className="ebook-text">
                        Let&apos;s go over everything that we learned today. There are two things you must understand about dreams. They are benevolent forces 
                        in your life that are there to guide you and help you in your life, and they speak to us through symbolic language. These symbols 
                        can come from two different sources, universal and individual. Universal symbols are definitions for symbols that we all share, 
                        whereas individual symbols are ones that are specific to your lived experience. Both of these types of symbols appear in dreams, 
                        and it is important to understand which are which when exploring your dream meaning.
                    </p>
                    <p className="ebook-text">
                        To break down these symbols, although it is possible to do it yourself, there are tools available that can help with this process 
                        of interpreting the symbols. We talked about a couple solutions, but my personal recommendation is Dream Oracles. We have carefully 
                        curated an experience that uses the strongest AI models and the best interpretation practices to help you understand your dreams.
                    </p>
                    <p className="ebook-text">
                        If you have any questions about the ebook or something you don&apos;t understand about the process of interpreting your dreams, please 
                        feel free to reach out. I would love to help answer any questions that might have come up during this ebook. Also, you now have 
                        access to this ebook for life, and anything that I learn about dreams, or any feedback that you bring to me, will be added to 
                        this ebook and updated. This is a living and breathing ebook, and it will continue to grow as time passes.
                    </p>
                    <p className="ebook-text">
                        I also want to mention that since you signed up for the ebook, you get a free interpretation at Dream Oracles. Next time you have 
                        a crazy dream, try us out! If you have any feedback or questions about our services at Dream Oracles, also feel free to reach out, 
                        as we are always improving our services and trying to provide the best possible experience for you.
                    </p>
                    <p className="ebook-text">
                        Otherwise, thank you for reading and downloading our ebook on dream interpretation. I hope that you learned something valuable that 
                        can help you better understand your dreams, and in turn be a better version of yourself. Keep dreaming!
                    </p>
                </div>
                <div className='text-center'>
                <div className="text-center mb-20">
                    <button
                        onClick={() => router.push('/')}
                        className="inline-block bg-blue-500 text-white font-medium py-2 px-4 rounded hover:bg-blue-700 transition"
                    >
                        Try Dream Oracles
                    </button>
                </div>
                </div>
            </div>
        );          
    }

    if (showSentEmailMessage) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-transparent text-white text-center md:w-2/3 md:mx-auto">
                <div className="space-y-4">
                    <p className="text-4xl font-bold">Thank You! Check Your Email</p>
                    <p className="text-lg">We&apos;ve just sent an email to you with a link to download your free dream interpretation e-book!</p>
                    <p className="text-lg">Be sure to check your inbox (and your spam or promotions folder, just in case). If you don&apos;t see it, feel free to reach out for help. Enjoy exploring the world of dreams!</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 p-6 bg-gray-800 rounded-lg shadow-lg">
                <h1 className="text-3xl font-extrabold text-white text-center">
                    Get Your Free Dream Interpretation Ebook
                </h1>
                <p className="mt-2 text-gray-400 text-center">
                    Enter your email below to receive a free copy of our dream interpretation guide, packed with insights and knowledge to help you understand your dreams.
                </p>
                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div className="rounded-md shadow-sm space-y-4">
                        <div>
                            <label htmlFor="name" className="sr-only">Name</label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                placeholder="Your Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="sr-only">Email</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Your Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                    </div>
                    {error && (
                        <div className="text-sm text-red-600">
                            {error}
                        </div>
                    )}
                    <div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            {loading ? 'Loading...' : 'Download Ebook'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}