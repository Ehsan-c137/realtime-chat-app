import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { UpstashRedisAdapter } from "@next-auth/upstash-redis-adapter";
import { db } from "@/lib/db";
import { fetchRedis } from "./utils/redis";

// export const authOptions: NextAuthOptions = {
//    adapter: UpstashRedisAdapter(db),

const getGoogleCredentials = () => {
   const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
   const clientSecret = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET;

   if (!clientId || clientId.length === 0) {
      throw new Error("Missing Google_Client_ID");
   }
   if (!clientSecret || clientSecret.length === 0) {
      throw new Error("Missing Google_Client_Secret");
   }

   return {
      clientId,
      clientSecret,
   };
};

export const authOptions: NextAuthOptions = {
   secret: process.env.NEXTAUTH_SECRET,
   adapter: UpstashRedisAdapter(db),
   session: {
      strategy: "jwt",
   },
   pages: {
      signIn: "/login",
   },
   providers: [
      GoogleProvider({
         clientId: getGoogleCredentials().clientId,
         clientSecret: getGoogleCredentials().clientSecret,
         authorization: {
            url: "https://accounts.google.com/o/oauth2/v2/auth",
            params: {
               scope: "openid email profile",
               prompt: "select_account",
               access_type: "offline", // If refresh tokens are needed
               response_type: "code", // Response type for authorization code
            },
         },
      }),
   ],
   callbacks: {
      async jwt({ token, user }) {
         // const dbUser = (await db.get(`user:${token.id}`)) as User | null;
         const dbUserResult = (await fetchRedis("get", `user:${token.id}`)) as
            | string
            | null;

         if (!dbUserResult) {
            token.id = user!.id;
            return token;
         }

         const dbUser = JSON.parse(dbUserResult) as User;

         return {
            id: dbUser.id,
            name: dbUser.name,
            email: dbUser.email,
            picture: dbUser.image,
         };
      },
      async session({ session, token }) {
         if (token) {
            session.user.id = token.id;
            session.user.name = token.name;
            session.user.email = token.email;
            session.user.image = token.picture;
         }

         return session;
      },
      redirect: async ({ url, baseUrl }) => {
         return url.startsWith(baseUrl) ? url : `${baseUrl}/dashboard`;
      },
   },
};

export const { handlers, auth, signin, signout } = NextAuth(authOptions);

export default NextAuth(authOptions);
