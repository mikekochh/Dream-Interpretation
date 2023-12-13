"use client"
import React from "react"
import { useRouter } from "next/navigation";

export default function PricingForm() { 

    const router = useRouter();

    function exit () {
        router.push('/journal');
    }

    function buyCredits () {
        console.log("buy credits");
    }

    function subscribe () {
        console.log("subscribe");
    }

    return (
    <div className="text-white text-center p-4 main-content">
        <h1 className="text-3xl">Pricing</h1>

        {/* Desktop view */}
        <div className="flex-row lg:flex hidden">
            <div className="border border-white rounded-xl pricing-card w-1/3"> 
                <h2 className="text-2xl pb-5">Free</h2>
                <div className="text-left">
                    <ul>
                        <li>• Ability to journal dreams</li>
                    </ul>
                </div>
            </div>
            <div className="border border-white rounded-xl pricing-card w-1/3 relative"> 
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
                    <button 
                        className="rounded-xl p-2 text-black m-2 bottom-0 left-1/2 transform -translate-x-1/2 absolute subscribe-button whitespace-nowrap"
                        onClick={buyCredits}
                    >
                        Buy 5 credits for $5
                    </button>
                </div>
            </div>
            <div className="border border-white rounded-xl pricing-card w-1/3 relative"> 
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
                    <button 
                        className="rounded-xl p-2 text-black m-2 bottom-0 left-1/2 transform -translate-x-1/2 absolute subscribe-button whitespace-nowrap"
                        onClick={subscribe}
                    >Subscribe for $7/month</button>
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
                    <button className="rounded-xl p-2 text-black m-2 mb-0 subscribe-button" onClick={buyCredits}>Buy 5 credits for $5</button>
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
                    <button className="rounded-xl p-2 text-black m-2 mb-0 subscribe-button" onClick={subscribe}>Subscribe for $7/month</button>
                </div>
            </div>
        </div>
    </div>
    )

}