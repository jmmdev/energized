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
                    const existingUser = await axios.get(`${process.env.SERVER_URL}/users/find/${credentials?.user}`);

                    if (!(existingUser?.data?.hasPassword)) {
                        throw new Error("Your email was used for a Google account login. Please, use that option instead");
                    }

                    const response = await axios.post(`${process.env.SERVER_URL}/login`, {
                        user: credentials?.user,
                        password: credentials?.password
                    });
                    const output = { 
                        id: String(response.data.id), 
                        name: response.data.name, 
                        email: response.data.email, 
                        role: response.data.role 
                    };
                    return output;
                }
                catch (err) {
                    const message =
                        err?.response?.data?.message ||
                        err?.message ||
                        "Login failed. Please try again.";

                    if (/invalid|wrong|unauthorized|password/i.test(message))
                        return null;

                    throw new Error(message);
                }
            }
        })
    ],
    callbacks: {
        async signIn({ user, account }) {
            try {
                const res = await axios.get(`${process.env.SERVER_URL}/users/find/${user.email}`);
                if (!res.data) {
                    await axios.post(`${process.env.SERVER_URL}/register`, {
                        username: user.name,
                        email: user.email,
                        image: user.image,
                    });
                }
            } catch (err) {
                if (err.response?.status === 404) {
                    await axios.post(`${process.env.SERVER_URL}/register`, {
                        username: user.name,
                        email: user.email,
                        image: user.image,
                    });
                } 
                else {
                    console.log(err.response.status);
                    return false;
                }
            }
            return true;
        },

        async jwt({token, account, user}) {
            if (user) {
                const response = await axios.get(`${process.env.SERVER_URL}/users/find/${user.email}`);

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