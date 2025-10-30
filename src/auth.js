import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import { SignJWT } from "jose";

const SECRET = new TextEncoder().encode(process.env.AUTH_SECRET);

async function mintAccessToken({ id, email, role, name }) {
  const now = Math.floor(Date.now() / 1000);
  const exp = now + 60 * 60;
  const jwt = await new SignJWT({ id, email, role, name })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt(now)
    .setExpirationTime(exp)
    .setIssuer("energized-app")
    .setAudience("xapi")
    .sign(SECRET);
  return { jwt, exp };
}

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
                        const existingUser = await axios.get(`${process.env.SERVER_URL}/users/find`, {
                            params: { user: credentials?.user}
                        });

                        if (!(existingUser?.data?.hasPassword)) {
                            throw new Error("Your email was used for a Google account login. Please, use that option instead");
                        }

                        const response = await axios.post(`${process.env.SERVER_URL}/login`, {
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
                    existingUser = await axios.get(`${process.env.SERVER_URL}/users/find`, {
                        params: {user: user.email}
                    });
                }
                catch (e) {
                    if (!existingUser?.data) {
                        await axios.post(`${process.env.SERVER_URL}/register`,{
                            username: user.name,
                            email: user.email,
                            image: user.image,
                        });
                    }
                }
                return true;
            },

            async jwt({token, account, user}) {
                if (user) {
                    const response = await axios.get(`${process.env.SERVER_URL}/users/find`, {
                        params: {user: user.email}
                    });

                    const dbUser = response.data.user;

                    if (dbUser) {
                        token.id = dbUser.id;
                        token.name = dbUser.name;
                        token.email = dbUser.email;
                        token.role = dbUser.role;
                    
                        const { jwt, exp } = await mintAccessToken({
                            id: token.id,
                            email: token.email,
                            role: token.role,
                            name: token.name,
                        });
                        token.accessToken = jwt;
                        token.accessTokenExp = exp;
                    }
                }

                const now = Math.floor(Date.now() / 1000);
                
                if (token.accessToken && typeof token.accessTokenExp === "number" && token.accessTokenExp - now < 300) {
                    const { jwt, exp } = await mintAccessToken({
                        id: String(token.id),
                        email: String(token.email),
                        role: token.role,
                        name: token.name,
                    });
                    token.accessToken = jwt;
                    token.accessTokenExp = exp;
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
                session.accessToken = token.accessToken;
                return session;
            },
        },
    })