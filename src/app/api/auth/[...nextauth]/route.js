import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { connectMongoDB } from '../../../../../lib/mongodb';
import User from '../../../../../models/user';
import bcrypt from 'bcryptjs';

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {},
            async authorize(credentials) {
                const { email, password } = credentials;

                try {
                    await connectMongoDB();
                    const user = await User.findOne({ email });

                    if (!user) {
                        return null;
                    }

                    const passwordsMatch = await bcrypt.compare(password, user.password);

                    if (!passwordsMatch) {
                        return null;
                    }

                    // Return the MongoDB user, which includes _id
                    return user;

                } catch (error) {
                    console.log("There was an error: ", error);
                }

                return null; 
            }
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    sessions: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/",
    },
    callbacks: {
        async signIn({ user, account, profile }) {
            if (account.provider === "google") {
                try {
                    await connectMongoDB();
                    const existingUser = await User.findOne({ email: user.email });

                    if (!existingUser) {
                        // Create a new user in MongoDB for Google SSO users
                        const newUser = new User({
                            name: user.name,
                            email: user.email,
                            password: "", // No password required for Google users
                        });
                        await newUser.save();
                        user._id = newUser._id;  // Assign MongoDB _id to the user object
                    } else {
                        user._id = existingUser._id; // Assign MongoDB _id from existing user
                    }
                } catch (error) {
                    console.log("Error in signIn callback: ", error);
                    return false;
                }
            }
            return true;
        },
        async session({ session, token }) {
            // Attach the MongoDB _id to the session object
            session.user.id = token._id; // Use _id from MongoDB
            return session;
        },
        async jwt({ token, user }) {
            // If user is signing in for the first time, assign MongoDB _id to the token
            if (user) {
                token._id = user._id; // Store the MongoDB _id in the JWT
            }
            return token;
        },
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
