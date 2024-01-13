"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import axios from "axios";


export default function PricingForm() { 

    const router = useRouter();
    const { data: session } = useSession();
    const [activated, setActivated] = useState(false);
    const [user, setUser] = useState(null);
    const [subscribed, setSubscribed] = useState(false);
    const [error, setError] = useState(false);

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
                setActivated(userData.activated);
                setUser(userData);
                setSubscribed(userData.subscribed);
            }).catch(err => {
                console.log('err: ', err);
            });
        }
    }, [session]);

    async function buyCredits () {
        const quantity = document.querySelector(".credit-quantity").value;
        if (quantity < 5) {
            setError(true);
            return;
        }
        const res = await axios.post("/api/user/purchase", {
            userID: user._id,
            paymentTypeID: 1,
            quantity: quantity
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

    function verifyEmail () {
        window.location.href = `/emailVerification?email=${session.user.email}`;
    }

    return (
    <div className="text-white text-center p-4 main-content text-xl">
        <h1 className="text-4xl">Pricing</h1>

        {/* Desktop view */}
        <div className="flex-row lg:flex hidden mb-5">
            <div className="border border-white rounded-xl pricing-card w-1/3"> 
                <h2 className="text-3xl pb-5">Free</h2>
                <div className="text-left">
                    <ul>
                        <li>• Ability to journal dreams</li>
                        <li>• Ability to take notes on dreams</li>
                    </ul>
                </div>
            </div>
            <div className="border border-white rounded-xl pricing-card w-1/3 relative"> 
                <h2 className="text-3xl pb-5">Pay As You Go</h2>
                <div className="text-left">
                    <ul>
                        <li>• Ability to journal dreams</li>
                        <li>• Expert interpretations from our Dream Oracles</li>
                        <li>• Ability to take notes on dreams</li>
                        <li>• Each <b>interpretation</b> costs 1 credit</li>
                        <li>• $2 per credit, no less than 5</li>
                    </ul>
                </div>
                <div className="bottom-0 left-1/2 transform -translate-x-1/2 absolute whitespace-nowrap">
                    {subscribed ? (<p className="text-green-500">You are subscribed, thank you!</p>) : (
                        <div>
                            <input type="number" className="rounded-xl p-2 text-black m-2 credit-quantity" placeholder="Enter number of credits to buy" />
                            <button className='rounded-xl p-2 text-black m-2 subscribe-button' onClick={buyCredits}>
                                Buy credits
                            </button>
                        </div>
                    )}
                    {error && (
                        <p className="text-red-500">You must buy at least 5 credits!</p>
                    )}
                </div>
            </div>
            <div className="border border-white rounded-xl pricing-card w-1/3 relative"> 
                <h2 className="text-3xl pb-5">Annual Subscription</h2>
                <div className="text-left">
                    <ul>
                        <li>• Ability to journal dreams</li>
                        <li>• Expert interpretations from our Dream Oracles</li>
                        <li>• Ability to take notes on dreams</li>
                        <li>• Unlimited interpretations</li>
                    </ul>
                </div>
                <div className="bottom-0 left-1/2 transform -translate-x-1/2 absolute whitespace-nowrap">
                    {subscribed ? (<p className="text-green-500">You are subscribed, thank you!</p>) : (
                        <div>
                            <button 
                                className='rounded-xl p-2 text-black m-2 subscribe-button'
                                onClick={subscribe}
                            >
                                Subscribe for $79/year
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* Mobile view */}
        <div className="flex-col lg:hidden flex">
            <div className="border border-white rounded-xl pricing-card-mobile"> 
                <h2 className="text-2xl pb-5">Free</h2>
                <div className="text-left">
                    <ul>
                        <li>• Ability to journal dreams</li>
                    </ul>
                </div>
            </div>
            <div className="border border-white rounded-xl pricing-card-mobile relative"> 
                <h2 className="text-2xl pb-5">Buy Credits</h2>
                <div className="text-left">
                    <ul>
                        <li>• Ability to journal dreams</li>
                        <li>• Ability to interpret dreams</li>
                        <li>• Ability to customize interpretations</li>
                        <li>• Ability to take notes on dreams</li>
                        <li>• Each <b>interpretation</b> costs 1 credit</li>
                        <li>• Interpretation customizations costs an additional credit</li>
                    </ul>
                </div>
                <div>
                    {subscribed ? (<p className="text-green-500">You are subscribed, thank you!</p>) : (
                        <div>
                            <button className={`rounded-xl p-2 text-black m-2 mb-0 subscribe-button ${!activated ? "hidden" : ""}`} onClick={buyCredits}>Buy 5 credits for $5</button>
                            <button className={`rounded-xl p-2 text-black m-2 mb-0 subscribe-button ${activated ? "hidden" : ""}`} onClick={verifyEmail}>Verify Email to Buy Credits</button>
                        </div>
                    )}
                </div>
            </div>
            <div className="border border-white rounded-xl pricing-card-mobile relative"> 
                <h2 className="text-2xl pb-5">Subscription</h2>
                <div className="text-left">
                    <ul>
                        <li>• Ability to journal dreams</li>
                        <li>• Ability to interpret dreams</li>
                        <li>• Ability to customize interpretations</li>
                        <li>• Ability to take notes on dreams</li>
                        <li>• Unlimited interpretations</li>
                        <li>• Freely use all interpretation customizations</li>
                    </ul>
                </div>
                <div>
                    {subscribed ? (<p className="text-green-500">You are subscribed, thank you!</p>) : (
                        <div>
                            <button className={`rounded-xl p-2 text-black m-2 mb-0 subscribe-button ${!activated ? "hidden" : ""}`} onClick={subscribe}>Subscribe for $7/month</button>
                            <button className={`rounded-xl p-2 text-black m-2 mb-0 subscribe-button ${activated ? "hidden" : ""}`} onClick={verifyEmail}>Verify Email to Buy Subscription</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
    )

}