import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

export const {
    handlers: {GET, POST},
    auth,
    signIn,
    signOut
} = NextAuth({
    session: {
        strategy: "jwt",
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,

            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code",
                }
            }
        }),
        CredentialsProvider({
            async authorize(credentials) {
                try {
                    const existingUser = await axios.get(`http://localhost:3500/api/users/${credentials?.user}`);

                    if (!(existingUser?.data?.hasPassword)) {
                        throw new Error("Your email was used for a Google account login. Please, use that option instead");
                    }

                    const response = await axios.post("http://localhost:3500/api/login", {
                        user: credentials?.user,
                        password: credentials?.password
                    });

                    return response.data;
                }
                catch (err) {
                    throw new Error(err.response.data.message);
                }
            }
        })
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            let existingUser;
            try {
                existingUser = await axios.get(`http://localhost:3500/api/users/${user.email}`);
            }
            catch (e) {
                if (!existingUser?.data) {
                    await axios.post("http://localhost:3500/api/register",{
                        username: user.name,
                        email: user.email,
                    });
                }
            }
            finally {
                return true;
            }
        },

        async jwt({token, user}) {
            if (user) {
                token.name = user.name;
                token.email = user.email;
                token.role = user.role;
                token.favorites = user.favorites;
            }
            return token;
        },

        async session({ session, token, user }) {
            session.user = {
                name: token.name,
                email: token.email,
                role: token.role,
                favorites: token.favorites,
            };
            return session;
        },
    },
})