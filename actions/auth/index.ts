"use server";

import { signOut } from "@/auth";

export const handleSignOutAction = async () =>
  await signOut({ redirectTo: "/" });
