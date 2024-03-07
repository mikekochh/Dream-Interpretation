import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../lib/mongodb';
import Oracle from '../../../../models/oracles';

export async function GET(req) {
    try {
        await connectMongoDB();
        const oracles = await Oracle.find();
        console.log('oracles: ', oracles);  
        return NextResponse.json(oracles);
    } catch (error) {
        console.log('error: ', error);
        return NextResponse.error(error);
    }
}