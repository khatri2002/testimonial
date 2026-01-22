import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { MessagesSquare, Pencil } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getSpace } from "./_lib/queries";
import Sidebar from "./components/sidebar";

interface SpaceLayoutProps {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
}

export default async function SpaceLayout({
  params,
  children,
}: SpaceLayoutProps) {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) redirect("/sign-in");

  const { slug } = await params;

  const space = await getSpace(slug, email);
  if (!space) notFound();

  const {
    name,
    _count: { responses },
  } = space;

  return (
    <>
      <div className="flex items-center justify-between border-b px-10 py-6">
        <h3 className="text-2xl font-semibold">{name}</h3>
        <div className="flex items-center gap-11">
          <div className="flex gap-2">
            <MessagesSquare className="size-5" />
            <div className="flex flex-col text-sm">
              <span>Testimonials</span>
              <span className="text-muted-foreground">{responses}</span>
            </div>
          </div>
          <Link href={`/dashboard/edit-space/${slug}`}>
            <Button className="bg-theme-primary hover:bg-theme-primary/85">
              <Pencil />
              Edit space
            </Button>
          </Link>
        </div>
      </div>
      <div className="flex flex-[1_1_0] overflow-hidden">
        <Sidebar slug={slug} className="p-3" />
        <div className="flex-[1_1_0] overflow-y-auto p-3">{children}</div>
      </div>
    </>
  );
}
