"use server";

import { signIn, signOut } from "@/auth";
import { saltRounds } from "@/lib/config";
import { authSchema } from "@/lib/schema";
import { AuthSchema } from "@/lib/schema.types";
import { prisma } from "@/prisma";
import bcrypt from "bcrypt";
import { AuthError } from "next-auth";

export const signUp = async (rawData: AuthSchema) => {
  const { data, success } = authSchema.safeParse(rawData);
  if (!success) return { success: false, message: "Invalid data" };

  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });
  if (existingUser)
    return {
      success: false,
      message: "Email already in use",
      description: "Try signing in instead",
    };

  try {
    const hash = bcrypt.hashSync(data.password, saltRounds);
    await prisma.user.create({ data: { email: data.email, password: hash } });
  } catch (err) {
    return { success: false, message: "Failed to sign up" };
  }

  try {
    await signIn("credentials", { ...data, redirect: false });
  } catch (err) {
    return { success: false, message: "Failed to sign in after sign up" };
  }

  return { success: true, message: "Signed up" };
};

export const signInWithOAuth = async (provider: "google" | "github") => {
  await signIn(provider, { redirectTo: "/dashboard" });
};

export const signInWithCredentials = async (data: AuthSchema) => {
  try {
    await signIn("credentials", { ...data, redirect: false });
    return { success: true, message: "Signed in" };
  } catch (err) {
    if (err instanceof Error) {
      const { type } = err as AuthError;
      switch (type) {
        case "CredentialsSignin":
          return { success: false, message: "Invalid credentials" };
        default:
          return { success: false, message: "Failed to sign in" };
      }
    }
    throw err;
  }
};

export const handleSignOutAction = async () =>
  await signOut({ redirectTo: "/" });
