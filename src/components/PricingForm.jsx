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
            }).catch(err => {
                console.log('err: ', err);
            });
        }
    }, [session]);

    async function buyCredits () {
        console.log("buy credits");
        const res = await axios.post("/api/purchase", {
            userID: user._id,
            paymentID: 1,
            quantity: 1
        });
        if (res.status === 200) {
            window.location.href = res.data.sessionID;
        }
        else {
            console.log("failure");
        }
    }

    async function subscribe () {
        console.log("subscribe");
        const res = await axios.post("/api/purchase", {
            userID: user._id,
            paymentID: 2,
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
        console.log("verify email");  
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
                    </ul>
                </div>
            </div>
            <div className="border border-white rounded-xl pricing-card w-1/3 relative"> 
                <h2 className="text-3xl pb-5">Buy Credits</h2>
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
                    <button 
                        className={`rounded-xl p-2 text-black m-2 bottom-0 left-1/2 transform -translate-x-1/2 absolute subscribe-button whitespace-nowrap ${!activated ? "hidden" : ""}`}
                        onClick={buyCredits}
                    >
                        Buy 5 credits for $5
                    </button>
                    <button 
                        className={`rounded-xl p-2 text-black m-2 bottom-0 left-1/2 transform -translate-x-1/2 absolute subscribe-button whitespace-nowrap ${activated ? "hidden" : ""}`}
                        onClick={verifyEmail}
                    >
                        Verify Email to Buy Credits
                    </button>
                </div>
            </div>
            <div className="border border-white rounded-xl pricing-card w-1/3 relative"> 
                <h2 className="text-3xl pb-5">Subscription</h2>
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
                    <button 
                        className={`rounded-xl p-2 text-black m-2 bottom-0 left-1/2 transform -translate-x-1/2 absolute subscribe-button whitespace-nowrap ${!activated ? "hidden" : ""}`}
                        onClick={subscribe}
                    >
                        Subscribe for $7/month
                    </button>
                    <button 
                        className={`rounded-xl p-2 text-black m-2 bottom-0 left-1/2 transform -translate-x-1/2 absolute subscribe-button whitespace-nowrap ${activated ? "hidden" : ""}`}
                        onClick={verifyEmail}
                    >
                        Verify Email to Buy Subscription
                    </button>
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
                    <button className={`rounded-xl p-2 text-black m-2 mb-0 subscribe-button ${!activated ? "hidden" : ""}`} onClick={buyCredits}>Buy 5 credits for $5</button>
                    <button className={`rounded-xl p-2 text-black m-2 mb-0 subscribe-button ${activated ? "hidden" : ""}`} onClick={verifyEmail}>Verify Email to Buy Credits</button>
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
                    <button className={`rounded-xl p-2 text-black m-2 mb-0 subscribe-button ${!activated ? "hidden" : ""}`} onClick={subscribe}>Subscribe for $7/month</button>
                    <button className={`rounded-xl p-2 text-black m-2 mb-0 subscribe-button ${activated ? "hidden" : ""}`} onClick={verifyEmail}>Verify Email to Buy Subscription</button>
                </div>
            </div>
        </div>
    </div>
    )

}