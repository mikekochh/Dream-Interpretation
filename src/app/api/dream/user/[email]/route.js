import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../../lib/mongodb';
import User from '../../../../../../models/user';
import Dream from '../../../../../../models/dream';

export async function GET(request) {
    try {
        const pathname = request.nextUrl.pathname;
        const email = pathname.split('/').pop();
        await connectMongoDB();

        const user = await User.findOne({ email: email });
        const userID = user._id.toString();

        const userDreams = await Dream.find({ userID: userID });

        return NextResponse.json(userDreams);
    }
    catch (error) {
        console.log('error: ', error);
        return NextResponse.error(error);
    }

}

// export async function GET(req) {
//     try {
//         const pathname = req.nextUrl.pathname;
//         const email = pathname.split('/').pop();
//         await connectMongoDB();
//         const user = await User.findOne({ email });
//         console.log('user: ', user);
//         if (!user) {
//             return NextResponse.error(new Error('User not found!'));
//         }
//         return NextResponse.json(user);
//     } catch (error) {
//         console.log('error: ', error);
//         return NextResponse.error(error);
//     }
// }