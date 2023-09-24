import NextAuth from 'next-auth/next';
import clientPromise from '../../../lib/mongodb_2';
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
export const options = {
    providers:[
        GoogleProvider({
            callbackURL: `${process.env.NEXTAUTH_URL}/api/auth/callback/google`,
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],

    secret: process.env.NEXTAUTH_SECRET,
    adapter: MongoDBAdapter(clientPromise),

    authorization:{
        url: process.env.NEXTAUTH_URL,
        params:{
            redirect_url: `${process.env.NEXTAUTH_URL}/api/auth/callback/google`,
        }
    },

   

};

export default NextAuth(options);