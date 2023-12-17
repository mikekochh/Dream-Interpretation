import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../lib/mongodb';
import User from "../../../../models/user";
import Payment from '../../../../models/payments';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
    try {
        await connectMongoDB();
        // create user
        console.log("how many times are we getting here?");
        const { session_id, userEmail } = await req.json();
        try {
            const session = await stripe.checkout.sessions.retrieve(session_id);
            if (!session) {
                throw new Error("Session not found!");
            }

            const payment = await Payment.findOne({ stripeSessionID: session_id });
            if (!payment) {
                throw new Error("Payment not found!");
            }

            if (session.payment_status === "paid" && !payment.paymentCompleted) {
                const updatedUser = await User.findOneAndUpdate({ email: userEmail }, { $inc: { credits: 5 } }, { new: true });
                if (!updatedUser) {
                    throw new Error("User not found!");
                }
                const updatedPayment = await Payment.findOneAndUpdate({ stripeSessionID: session_id }, { paymentCompleted: true }, { new: true });
            }
            else if (payment.paymentCompleted) {
                throw new Error("Payment already completed!");
            }
            else if (session.payment_status !== "paid") {
                throw new Error("Payment not completed!");
            }
            return NextResponse.json({message: "User credits successfully purchased and updated!"}, { status: 200 });
        } catch (error) {
            console.log('error before the thing: ', error);
            return NextResponse.json({message: error.message}, { status: 500 });
        }
    } catch (error) {
        console.log('error after the thing: ', error);
        return NextResponse.json({message: "User activation failed!"}, { status: 500 })
    }
}
