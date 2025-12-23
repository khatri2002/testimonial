import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { Plus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { auth } from "../auth";
import SearchInput from "./_components/search-input";
import { SpaceCardsSkeleton } from "./_components/space-card";
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

      <div className="mt-6">
        <Suspense fallback={<SpaceCardsSkeleton />}>
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

  return spaces.length === 0 ? (
    <div className="fixed top-1/2 left-1/2 -translate-1/2">
      <p className="space-y-1 text-center text-nowrap">
        <span className="block text-lg font-medium">
          You have no spaces yet.
        </span>
        <span className="text-muted-foreground block text-sm">
          Click the &quot;Create a new Space&quot; button to get started!
        </span>
      </p>
    </div>
  ) : (
    <SpaceCardsClient spaces={spaces} />
  );
}
