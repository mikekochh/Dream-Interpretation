import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../../lib/mongodb';
import User from '../../../../../../models/user';
import Dream from '../../../../../../models/dream';

export async function GET(request) {
    try {
        const pathname = request.nextUrl.pathname;
        const dreamID = pathname.split('/').pop();
        console.log("dreamID: ", dreamID);
        await connectMongoDB();

        const dream = await Dream.findOne({ _id: dreamID });

        console.log("found the dream: ", dream);

        if (dream) {
            const user = await User.findOne({ _id: dream.userID });

            if (user) {
                return NextResponse.json({user});
            }
            else {
                return NextResponse.json({ error: 'User not found' }, { status: 404 });
            }
        } else {
            return NextResponse.json({ error: 'Dream not found' }, { status: 404 });
        }
    }
    catch (error) {
        console.log('error: ', error);
        return NextResponse.error(error);
    }
}