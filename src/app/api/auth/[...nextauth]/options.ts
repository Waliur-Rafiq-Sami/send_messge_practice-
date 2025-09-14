import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel, { User as DBUser } from "@/model/User";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        identifier: { label: "Email/Username", type: "text", placeholder: "xys@abc.todo" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: Record<"identifier" | "password", string> | undefined) {
        if (!credentials) return null;

        await dbConnect();

        try {
          const user: DBUser | null = await UserModel.findOne({
            $or: [{ email: credentials.identifier }, { username: credentials.identifier }],
          });

          if (!user) throw new Error("No user found with this email");
          if (!user.isVerified) throw new Error("Please verify your account before login");

          const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
          if (!isPasswordCorrect) throw new Error("Incorrect password");

          if (!user._id) throw new Error("User _id is missing"); // ✅ Type safety

          // Map Mongoose user to NextAuth user type
          return {
            id: user._id.toString(), // required by NextAuth
            _id: user._id.toString(),
            username: user.username,
            email: user.email,
            isVerified: user.isVerified,
            isAcceptingMessage: user.isAcceptingMessage,
          };
        } catch (error) {
          console.error(error);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id as string;
        token.isVerified = user.isVerified as boolean;
        token.isAcceptingMessage = user.isAcceptingMessage as boolean;
        token.username = user.username as string;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id as string;
        session.user.isVerified = token.isVerified as boolean;
        session.user.isAcceptingMessage = token.isAcceptingMessage as boolean;
        session.user.username = token.username as string;
      }
      return session;
    },
  },

  pages: {
    signIn: "/sign-in",
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,
};
