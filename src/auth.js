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
    secret: process.env.AUTH_SECRET,
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
                    const existingUser = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/find/${credentials?.user}`);

                    if (!(existingUser?.data?.hasPassword)) {
                        throw new Error("Your email was used for a Google account login. Please, use that option instead");
                    }

                    const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/login`, {
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
                existingUser = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/find/${user.email}`);
            }
            catch (e) {
                if (!existingUser?.data) {
                    await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/register`,{
                        username: user.name,
                        email: user.email,
                        image: user.image,
                    });
                }
            }
            finally {
                return true;
            }
        },

        async jwt({token, account, user}) {
            if (user) {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/find/${user.email}`);

                const dbUser = response.data.user;

                if (dbUser) {
                    token.id = dbUser.id;
                    token.name = dbUser.name;
                    token.email = dbUser.email;
                    token.role = dbUser.role;
                }    
            }
            return token;
        },

        async session({ session, token }) {
            session.user = {
                id: token.id,
                name: token.name,
                email: token.email,
                role: token.role,
            };
            return session;
        },
    },
})