"use server";

import { signIn, signOut } from "@/app/auth";

export const handleSignInAction = async (provider: "google" | "github") =>
  await signIn(provider, { redirectTo: "/dashboard" });

export const handleSignOutAction = async () =>
  await signOut({ redirectTo: "/" });
