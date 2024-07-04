import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../lib/mongodb';
import Gender from '../../../../models/genders';
import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';

export async function GET(req) {
    try {
        await connectMongoDB();
        
        const url = new URL(req.url);
        const genderID = url.searchParams.get('genderID');

        console.log("genderID: ", genderID);
        
        if (!genderID) {
            return NextResponse.json({ error: 'genderID is required' }, { status: 400 });
        }

        const gender = await Gender.findOne({genderID})
        
        if (!gender) {
            return NextResponse.json({ error: 'Gender not found' }, { status: 404 });
        }
        
        return NextResponse.json({ name: gender.name });
    } catch (error) {
        console.log('error: ', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
