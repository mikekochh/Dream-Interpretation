import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../lib/mongodb';
import User from '../../../../../models/user';

const isLocalEnvironment = process.env.NODE_ENV === 'development';
const stripeSecretKey = isLocalEnvironment ? process.env.STRIPE_SECRET_KEY_TEST : process.env.STRIPE_SECRET_KEY;
const stripe = require('stripe')(stripeSecretKey);

export async function POST(req) {
    try {
        await connectMongoDB();
        const { userID, subscriptionID } = await req.json();
        const canceledSubscription = await stripe.subscriptions.cancel(
            subscriptionID
        );

        if (!canceledSubscription) {
            throw new Error("Subscription not found!");
        }

        const updatedUser = await User.findOneAndUpdate({ _id: userID }, { subscribed: false, subscriptionID: null }, { new: true });

        if (!updatedUser) {
            throw new Error("User not found!");
        }

        return NextResponse.json({message: "User subscription successfully canceled successfully!"}, { status: 200 })
    } catch (error) {
        console.log('error: ', error);
        return NextResponse.json({message: "User activation failed!"}, { status: 500 })
    }
}