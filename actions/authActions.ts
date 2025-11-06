"use server";

import { signIn } from "@/app/auth";

export const handleSignInAction = async (provider: "google" | "github") =>
  await signIn(provider, { redirectTo: "/dashboard" });
