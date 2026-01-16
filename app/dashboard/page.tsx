import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { FilePlusCorner } from "lucide-react";
import { redirect } from "next/navigation";
import CreateNewSpaceBtn from "./_components/create-new-space-btn";
import SearchInput from "./_components/search-input";
import SpaceCards from "./_components/space-cards";

export default async function Dashboard() {
  const session = await auth();
  if (!session?.user?.email) redirect("/sign-in");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      spaces: {
        orderBy: { created_at: "desc" },
        include: { _count: { select: { responses: true } } },
      },
    },
  });
  if (!user) redirect("sign-in");

  const { spaces } = user;
  const hasSpaces = spaces.length > 0;

  return (
    <div className="mx-5 my-4 sm:mx-10 md:mx-15 lg:mx-20 xl:mx-24">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold sm:text-2xl">Spaces</h1>
        {hasSpaces && <CreateNewSpaceBtn />}
      </div>

      {hasSpaces && <SearchInput className="mt-5" />}

      <div className="mt-4 sm:mt-6">
        {hasSpaces ? (
          <SpaceCards spaces={spaces} />
        ) : (
          <div className="bg-card flex flex-col items-center rounded-lg p-7">
            <FilePlusCorner className="text-muted-foreground size-10" />
            <div className="mt-4 space-y-1 text-center">
              <h3 className="text-lg">No spaces yet</h3>
              <p className="text-muted-foreground text-sm">
                Create your first space to start collecting testimonials
              </p>
            </div>
            <CreateNewSpaceBtn className="mt-5" />
          </div>
        )}
      </div>
    </div>
  );
}
