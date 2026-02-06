import { prisma } from "@/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcrypt";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { authSchema } from "./lib/schema";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google,
    GitHub,
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const { success, data } = authSchema.safeParse(credentials);
        if (!success) return null;

        const user = await prisma.user.findUnique({
          where: { email: data.email },
        });
        if (!user || !user.password) return null;

        const isPasswordValid = bcrypt.compareSync(
          data.password,
          user.password,
        );
        if (!isPasswordValid) return null;

        return user;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/sign-in",
  },
});
