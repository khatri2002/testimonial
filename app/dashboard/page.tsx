import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { Plus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { auth } from "../auth";
import SearchInput from "./_components/search-input";
import { SpaceCardSkeleton } from "./_components/space-card";
import SpaceCardsClient from "./_components/space-cards-client";

export default async function Dashboard() {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) redirect("/sign-in");

  return (
    <div className="mx-4 my-5 sm:mx-10 md:mx-15 lg:mx-20">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-medium sm:text-3xl">Spaces</h1>
        <Link href="dashboard/create-space">
          <Button className="bg-theme-primary hover:bg-theme-primary/90">
            <Plus />
            Create a new Space
          </Button>
        </Link>
      </div>
      <SearchInput className="mt-5" />
      <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        <Suspense
          fallback={[...Array(3)].map((_, i) => (
            <SpaceCardSkeleton key={i} />
          ))}
        >
          <SpaceCards email={email} />
        </Suspense>
      </div>
    </div>
  );
}

interface SpaceCardsProps {
  email: string;
}
async function SpaceCards({ email }: SpaceCardsProps) {
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      spaces: { include: { _count: { select: { responses: true } } } },
    },
  });
  if (!user) redirect("/sign-in");

  const { spaces } = user;

  return <SpaceCardsClient spaces={spaces} />;
}
