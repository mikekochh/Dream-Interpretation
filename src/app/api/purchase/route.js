import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../lib/mongodb';
import User from '../../../../models/user';
import Payment from '../../../../models/payments';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
    try {
        const { userID, paymentID, quantity } = await req.json();

        console.log('userID: ', userID);
        console.log('paymentID: ', paymentID);
        console.log('quantity: ', quantity);

        await connectMongoDB();

        const paymentObject = await Payment.findOne({ paymentID });

        const payment = paymentObject.toObject();

        console.log("payment: ", payment);

        if (!payment) {
            throw new Error("Payment not found!");
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: payment.paymentType,
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: payment.paymentName,
                        },
                        unit_amount: 0,
                    },
                    quantity: quantity,
                },
            ],
            success_url: process.env.DOMAIN + '/success',
        });

        console.log("session: ", session);

        return NextResponse.json({sessionID: session.url}, { status: 200 });
    } catch (error) {
        console.log('error: ', error);
        return NextResponse.json({message: "User activation failed!"}, { status: 500 })
    }
}