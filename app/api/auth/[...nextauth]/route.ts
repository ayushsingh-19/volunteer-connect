import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,

  pages: {
    signIn: "/login",
  },

  callbacks: {
    async signIn({ user }) {
      await connectDB();

      const existingUser = await User.findOne({ email: user.email });

      if (!existingUser) {
        await User.create({
          name: user.name,
          email: user.email,
          role: "User",
        });
      }

      return true;
    },

    async jwt({ token }) {
      await connectDB();

      const dbUser = await User.findOne({ email: token.email });

      if (dbUser) {
        token.id = dbUser._id.toString();
        token.role = dbUser.role;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },

    // ✅ ADD THIS — THIS IS THE FIX
    async redirect({ baseUrl }) {
      return baseUrl; // always "/"
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
