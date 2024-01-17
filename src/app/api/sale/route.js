import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../lib/mongodb';
import Sale from '../../../../models/sale';

export async function GET(req) {
    try {
        await connectMongoDB();
        const sale = await Sale.find({isSale: true});
        return NextResponse.json(sale);
    } catch (error) {
        console.log('error: ', error);
        return NextResponse.error(error);
    }
}