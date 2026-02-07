import { auth } from "@/auth";
import { MessagesSquare } from "lucide-react";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { getSpace } from "./_lib/queries";
import EditSpaceBtn from "./components/edit-space-btn";
import Loading from "./components/loading";
import Sidebar from "./components/sidebar";

interface SpaceLayoutProps {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
}

export default async function SpaceLayout({
  params,
  children,
}: SpaceLayoutProps) {
  const { slug } = await params;

  return (
    <Suspense fallback={<Loading />}>
      <SpaceLayoutData slug={slug}>{children}</SpaceLayoutData>
    </Suspense>
  );
}

interface SpaceLayoutDataProps {
  slug: string;
  children: React.ReactNode;
}

async function SpaceLayoutData({ slug, children }: SpaceLayoutDataProps) {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) redirect("/sign-in");

  const space = await getSpace(slug, email);
  if (!space) notFound();

  const {
    name,
    _count: { responses },
  } = space;

  return (
    <>
      <div className="flex flex-col items-center justify-between gap-4 border-b px-5 py-4 sm:flex-row sm:px-8 lg:px-10 lg:py-6">
        <h3 className="text-xl font-semibold sm:text-2xl">{name}</h3>
        <div className="flex w-full items-center justify-between gap-11 sm:w-auto">
          <div className="flex gap-2">
            <MessagesSquare className="size-5" />
            <div className="flex flex-col text-sm">
              <span>Testimonials</span>
              <span className="text-muted-foreground">{responses}</span>
            </div>
          </div>
          <EditSpaceBtn slug={slug} />
        </div>
      </div>
      <div className="flex flex-[1_1_0] overflow-hidden">
        <Sidebar slug={slug} className="p-2 sm:p-3" />
        <div className="flex-[1_1_0] overflow-y-auto p-2 sm:p-3">
          {children}
        </div>
      </div>
    </>
  );
}
