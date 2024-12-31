import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../lib/mongodb';
import Symbol from '../../../../../models/symbols';
import Redis from 'ioredis';

// Initialize Redis client
const redis = new Redis(); // Default host: localhost, port: 6379

export async function GET(req) {
    try {
        const cacheKey = 'dreamSymbols';

        // Check if data is in Redis cache
        const cachedSymbols = await redis.get(cacheKey);
        if (cachedSymbols) {
            console.log('Serving dream symbols from Redis');
            return NextResponse.json(JSON.parse(cachedSymbols));
        }

        // Fetch data from MongoDB
        console.log('Fetching dream symbols from database');
        await connectMongoDB();
        const dreamSymbols = await Symbol.find().sort();

        // Store data in Redis with 1-hour expiration
        await redis.set(cacheKey, JSON.stringify(dreamSymbols), 'EX', 3600);

        return NextResponse.json(dreamSymbols);
    } catch (error) {
        console.log('Error getting dream symbols:', error);
        return NextResponse.error(error);
    }
}
