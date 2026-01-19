"use server";

import { prisma } from "@/prisma";

export const addTest = async () => {
  await prisma.test.create({ data: { test_name: "test" } });
};
