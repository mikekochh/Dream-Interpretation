// /api/views/addView

import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../lib/mongodb';
import View from '../../../../../models/views';
import requestIp from 'request-ip';
import axios from 'axios';

export async function POST(req) {
    try {
        await connectMongoDB(); // Connect to MongoDB
        const { userID, pageID, isFromInstagram, sessionLength } = await req.json();

        // Attempt to get the IP address from headers
        let clientIp = requestIp.getClientIp(req);

        // Fallback options for IP if requestIp fails
        if (!clientIp) {
            clientIp = req.headers.get('x-forwarded-for')?.split(',')[0] || 
                        req.headers.get('x-real-ip') || 
                        req.headers.get('cf-connecting-ip'); // Cloudflare specific header
        }

        const geoData = await axios.get(`https://ipinfo.io/${clientIp}?token=ef0ca1e947eb04`);

        const { region, country, city } = geoData.data;

        const location = city + ", " + region + " " + country;
        
        // Get the current date
        const viewDate = new Date();

        // Create a new view record
        const newView = new View({
            userID,
            pageID,
            view_date: viewDate,
            isFromInstagram,
            location,
            sessionLength
        });

        // Save the view record
        await newView.save();

        console.log("View recorded: ", newView);

        return NextResponse.json({ success: true, view: newView });
        
    } catch (error) {
        console.error("There was an error recording the view: ", error);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
