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
                        const newUser = new User({
                            name: user.name,
                            email: user.email,
                            password: "", // No password as the user is using Google SSO
                        });
                        await newUser.save();
                    }
                } catch (error) {
                    console.log("Error in signIn callback: ", error);
                    return false;
                }
            }
            return true;
        },
        async session({ session, token }) {
            session.user.id = token.sub;
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.sub = user.id;
            }
            return token;
        },
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
