"use client";
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';

const PurchaseButton = ({ buttonText, user }) => {

    const purchaseSubscription = async () => {
        console.log("user: ", user);
        const res = await axios.post("/api/user/purchase", {
            userID: user._id,
            paymentTypeID: 5,
            quantity: 1
        });
        if (res.status === 200) {
            window.location.href = res.data.sessionID;
        }
        else {
            console.log("purchase failure");
        }
    }

    return (
        <div>
            <button onClick={purchaseSubscription} className="start-button">{buttonText}</button>
        </div>
    )
}

export default PurchaseButton;