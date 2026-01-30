
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma"; // Use Singleton
import bcrypt from "bcryptjs";

// const prisma = new PrismaClient(); // Removed local instantiation

import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {


                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Invalid credentials");
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email }
                });

                if (!user) {

                    throw new Error("User not found");
                }


                if (!user.password) {

                    throw new Error("Password not set");
                }


                const isValid = await bcrypt.compare(credentials.password, user.password);

                if (!isValid) {

                    throw new Error("Invalid password");
                }


                return user;
            }
        })
    ],
    callbacks: {
        async session({ session }) {
            // Add user ID to session from database
            if (session.user?.email) {
                const dbUser = await prisma.user.findUnique({
                    where: { email: session.user.email },
                });
                if (dbUser) {

                    session.user.id = dbUser.id;

                    session.user.role = dbUser.role;
                }
            }
            return session;
        },
    },
    pages: {
        signIn: '/login',
        error: '/login', // Error code passed in query string as ?error=
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
