"use client"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react";
import axios from "axios";


export default function PricingForm() { 

    const { data: session } = useSession();
    const [user, setUser] = useState(null);
    const [subscribed, setSubscribed] = useState(false);
    const [error, setError] = useState("");
    const [sale, setSale] = useState(null);

    useEffect(() => {
        async function setUserData() {
            const email = session?.user?.email;
            const res = await fetch(`api/user/${email}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            return res.json();
        }

        if (session) {
            setUserData().then(userData => {
                setUser(userData);
                setSubscribed(userData.subscribed);
            }).catch(err => {
                console.log('err: ', err);
            });
        }
    }, [session]);

    useEffect(() => {
        const getSale = async () => {
            const res = await fetch('/api/sale', {
                method: 'GET',
                cache: 'no-cache',
                headers: {
                    'Cache-Control': 'no-cache'
                }
            });
            const sale = await res.json();
            setSale(sale[0]);
        }
    
        getSale();
    }, []);
    

    async function buyCredits () {
        const quantity = document.querySelector(".credit-quantity").value;
        const quantityMobile = document.querySelector(".credit-quantity-mobile").value;
        if ((sale && quantity < 8 && quantityMobile < 8) || (!sale && quantity < 5 && quantityMobile < 5)) {
            setError(sale ? "You must buy at least 8 credits!" : "You must buy at least 5 credit!");
            return;
        }
        setError("");
        const realQuantity = quantity ? quantity : quantityMobile;
        const res = await axios.post("/api/user/purchase", {
            userID: user._id,
            paymentTypeID: 1,
            quantity: realQuantity
        });
        if (res.status === 200) {
            window.location.href = res.data.sessionID;
        }
        else {
            console.log("failure");
        }
    }

    async function subscribe () {
        const res = await axios.post("/api/user/purchase", {
            userID: user._id,
            paymentTypeID: 2,
            quantity: 1
        });
        if (res.status === 200) {
            window.location.href = res.data.sessionID;
        }
        else {
            console.log("failure");
        }
    }

    async function joinCommunity () {
        const res = await axios.post("/api/user/purchase", {
            userID: user._id,
            paymentTypeID: 4,
            quantity: 1
        });
        if (res.status === 200) {
            window.location.href = res.data.sessionID;
        }
        else {
            console.log("failure");
        }
    }

    function verifyEmail () {
        window.location.href = `/emailVerification?email=${session.user.email}`;
    }

    return (
    <div className="text-white text-center p-4 main-content text-xl">
        <h1 className="golden-ratio-4">Shop</h1>
        {sale && (
            <div className="sale-top-banner rounded-lg text-black mt-2 p-1 mx-4">
                {sale.bannerMessage}
            </div>
        )}

        {/* Desktop view */}
        <div className="flex-row lg:flex hidden mb-5 golden-ratio-2">
            <div className={`${sale ? 'pricing-card-sale' : 'pricing-card'}`}> 
                <h2 className="golden-ratio-3 pb-5">Telegram Chat</h2>
                <div className="text-left">
                    <ul>
                        <li>• Meet other dreamers</li>
                        <li>• Share dreams and interpretations</li>
                        <li>• Make life long friends revolving around dreams</li>
                        <li>• Partake in discussions about dream interpretation theories</li>
                        {sale ? (
                            <div>
                                <li className="line-through">• $6 for admission</li>
                                <li className="sale-text">{sale.telegramText}</li>
                            </div>
                        ) : (<li>• $6 for admission</li>)}
                    </ul>
                </div>
                <div>
                    <div className="bottom-0 absolute left-1/2 transform -translate-x-1/2 p-2">
                        {user?.communityAccess ? (<p className="text-green-500">You are already a member, thank you!</p>) : (
                            <button className='rounded-xl p-2 text-black m-2 mb-0 subscribe-button' onClick={joinCommunity}>Join Community</button>
                        )}
                    </div>
                </div>
            </div>
            <div className={`${sale ? 'pricing-card-sale' : 'pricing-card'}`}> 
                <h2 className="golden-ratio-3 pb-5">Pay As You Go</h2>
                <div className="text-left">
                    <ul>
                        <li>• Ability to journal dreams</li>
                        <li>• Expert interpretations from our Dream Oracles</li>
                        <li>• Ability to take notes on dreams</li>
                        <li>• Each <b>interpretation</b> costs 1 credit</li>
                        {sale ? (
                            <div>
                                <li className="line-through">• $1.99 per credit, no less than 5</li>
                                <li className="sale-text">{sale.creditText}</li>
                            </div>
                        ) : (<li>• $1.99 per credit, no less than 5</li>)}
                    </ul>
                </div>
                <div className="bottom-0 left-1/2 transform -translate-x-1/2 absolute whitespace-nowrap">
                    {subscribed ? (<p className="text-green-500">You are subscribed, thank you!</p>) : (
                        <div>
                            <input type="number" className="rounded-xl p-2 text-black m-2 credit-quantity" placeholder="Enter # of credits" />
                            <button className='rounded-xl p-2 text-black m-2 subscribe-button' onClick={buyCredits}>
                                Buy credits
                            </button>
                        </div>
                    )}
                    {error && (
                        <p className="text-red-500">{error}</p>
                    )}
                </div>
            </div>
            <div className={`${sale ? 'pricing-card-sale' : 'pricing-card'}`}> 
                <h2 className="golden-ratio-3 pb-5">Annual Subscription</h2>
                <div className="text-left">
                    <ul>
                        <li>• Ability to journal dreams</li>
                        <li>• Expert interpretations from our Dream Oracles</li>
                        <li>• Ability to take notes on dreams</li>
                        <li>• Unlimited interpretations</li>
                        <li>• Access to Telegram Chat for life</li>
                        <li>• All future services included</li>
                        {sale ? (
                            <div>
                                <li className="line-through">• $37/year</li>
                                <li className="sale-text">{sale.subscriptionText}</li>
                            </div>
                        ) : (<li>• $37/year</li>)}
                    </ul>
                </div>
                <div className="bottom-0 left-1/2 transform -translate-x-1/2 absolute whitespace-nowrap">
                    {subscribed ? (<p className="text-green-500">You are subscribed, thank you!</p>) : (
                        <div>
                            <button 
                                className='rounded-xl p-2 text-black m-2 subscribe-button'
                                onClick={subscribe}
                            >
                                Subscribe
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* Mobile view */}
        <div className="flex-col lg:hidden flex golden-ratio-2">
            <div className="border border-white rounded-xl pricing-card-mobile relative"> 
                <h2 className="pb-5 golden-ratio-3">Subscription</h2>
                <div className="text-left">
                    <ul>
                        <li>• Ability to journal dreams</li>
                        <li>• Expert interpretations from our Dream Oracles</li>
                        <li>• Ability to take notes on dreams</li>
                        <li>• Unlimited interpretations</li>
                        <li>• Access to Telegram Chat for life</li>
                        <li>• All future services included</li>
                        {sale ? (
                            <div>
                                <li className="line-through">• $37/year</li>
                                <li className="sale-text">{sale.subscriptionText}</li>
                            </div>
                        ) : (<li>• $37/year</li>)}
                    </ul>
                </div>
                <div>
                    {subscribed ? (<p className="text-green-500">You are subscribed, thank you!</p>) : (
                        <div>
                            <button className='rounded-xl p-2 text-black m-2 mb-0 subscribe-button' onClick={subscribe}>Subscribe</button>
                        </div>
                    )}
                </div>
            </div>
            <div className="border border-white rounded-xl pricing-card-mobile relative"> 
                <h2 className="text-2xl pb-5 golden-ratio-3">Pay As You Go</h2>
                <div className="text-left">
                    <ul>
                        <li>• Ability to journal dreams</li>
                        <li>• Expert interpretations from our Dream Oracles</li>
                        <li>• Ability to take notes on dreams</li>
                        <li>• Each <b>interpretation</b> costs 1 credit</li>
                        {sale ? (
                            <div>
                                <li className="line-through">• $1.99 per credit, no less than 5</li>
                                <li className="sale-text">{sale.creditText}</li>
                            </div>
                        ) : (<li>• $1.99 per credit, no less than 5</li>)}
                    </ul>
                </div>
                <div>
                    {subscribed ? (<p className="text-green-500">You are subscribed, thank you!</p>) : (
                        <div>
                            <input type="number" className="rounded-xl p-2 text-black m-2 credit-quantity-mobile" placeholder="Enter # of credits" />
                            <button className='rounded-xl p-2 text-black m-2 mb-0 subscribe-button' onClick={buyCredits}>Buy credits</button>
                        </div>
                    )}
                    {error && (
                        <p className="text-red-500">You must buy at least 5 credits!</p>
                    )}
                </div>
            </div>
            <div className="border border-white rounded-xl pricing-card-mobile"> 
                <h2 className="golden-ratio-3 pb-5">Telegram Chat</h2>
                <div className="text-left">
                    <ul>
                        <li>• Meet other dreamers</li>
                        <li>• Share dreams and interpretations</li>
                        <li>• Make life long friends revolving around dreams</li>
                        <li>• Partake in discussions about dream interpretation theories</li>
                        {sale ? (
                            <div>
                                <li className="line-through">• $6 for admission</li>
                                <li className="sale-text">{sale.telegramText}</li>
                            </div>
                        ) : (<li>• $6 for admission</li>)}
                    </ul>
                </div>
                <div>
                    <div>
                        {user?.communityAccess ? (<p className="text-green-500">You are already a member, thank you!</p>) : (
                            <button className='rounded-xl p-2 text-black m-2 mb-0 subscribe-button' onClick={joinCommunity}>Join Community</button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    </div>
    )
}