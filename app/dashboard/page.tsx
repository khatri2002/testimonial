import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import prisma from "@/lib/prisma";
import { Plus, Search } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { auth } from "../auth";
import { SpaceCard, SpaceCardSkeleton } from "./_components/space-card";

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
      <div className="focus-within:outline-ring focus-within:ring-ring/50 bg-muted mt-5 flex items-center rounded-md border outline-[1.5px] outline-transparent transition-all">
        <div className="flex size-10 items-center justify-center">
          <Search size={18} />
        </div>
        <Input
          className="border-none bg-transparent! px-1 text-base! focus-visible:ring-0"
          placeholder="Search testimonials by name"
        />
      </div>
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

  return spaces.map((space) => <SpaceCard key={space.id} space={space} />);
}
