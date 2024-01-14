import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../lib/mongodb';
import User from '../../../../../models/user';
import PaymentType from '../../../../../models/paymentTypes';
import Payment from '../../../../../models/payments';

const isLocalEnvironment = process.env.NODE_ENV === 'development';
const stripeSecretKey = isLocalEnvironment ? process.env.STRIPE_SECRET_KEY_TEST : process.env.STRIPE_SECRET_KEY;
const stripe = require('stripe')(stripeSecretKey);

export async function POST(req) {
    try {
        const { userID, paymentTypeID, quantity } = await req.json();
        await connectMongoDB();
        const paymentTypeObject = await PaymentType.findOne({ paymentTypeID });

        if (!paymentTypeObject) {
            throw new Error("Payment type not found!");
        }

        const paymentType = paymentTypeObject.toObject();

        if (!paymentType) {
            throw new Error("Payment type not found!");
        }

        let session = null;

        if (paymentType.paymentTypeID === 1) {
            session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                mode: paymentType.paymentTypeName,
                line_items: [
                    {
                        price_data: {
                            currency: 'usd',
                            product_data: {
                                name: paymentType.paymentTypeDescription,
                            },
                            unit_amount: paymentType.paymentTypePrice,
                        },
                        quantity: quantity,
                    },
                ],
                success_url: process.env.DOMAIN + '/success/credits?session_id={CHECKOUT_SESSION_ID}',
            });
        }
        else if (paymentType.paymentTypeID === 2) {
            session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                mode: paymentType.paymentTypeName,
                line_items: [
                    {
                        price: paymentType.paymentTypePriceID,
                        quantity: quantity,
                    },
                ],
                success_url: process.env.DOMAIN + '/success/subscription?session_id={CHECKOUT_SESSION_ID}',
            });
        }
        else {
            throw new Error("Invalid payment type!");
        }

        const newPayment = await Payment.create({
            paymentTypeID,
            paymentTypeName: paymentType.paymentTypeName,
            userID,
            paymentDate: new Date(),
            paymentAmount: paymentType.paymentTypePrice,
            paymentCompleted: false,
            stripeSessionID: session.id,
            quantity
        });
        
        if (!newPayment) {
            throw new Error("Failed to create new payment");
        }

        return NextResponse.json({sessionID: session.url}, { status: 200 });
    } catch (error) {
        console.log('error: ', error);
        return NextResponse.json({message: "User activation failed!"}, { status: 500 })
    }
}