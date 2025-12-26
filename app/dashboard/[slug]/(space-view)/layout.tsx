import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { MessageSquareText, Pencil } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Sidebar from "./_components/Sidebar";

interface SlugLayoutProps {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
}

export default async function SlugLayout({
  params,
  children,
}: SlugLayoutProps) {
  const { slug } = await params;
  const space = await prisma.space.findUnique({
    where: { slug },
    include: { _count: { select: { responses: true } } },
  });
  if (!space) notFound();

  const {
    name,
    _count: { responses },
  } = space;

  return (
    <>
      <div className="flex items-center justify-between px-5 py-7">
        <h2 className="text-xl font-medium">{name}</h2>
        <div className="flex items-center gap-12">
          <div className="flex gap-2">
            <MessageSquareText size={17} className="mt-1" />
            <div className="flex flex-col">
              <span className="">Testimonials</span>
              <span className="text-muted-foreground">{responses}</span>
            </div>
          </div>

          <Link href={`/dashboard/${slug}/edit-space`}>
            <Button>
              <Pencil />
              Edit Space
            </Button>
          </Link>
        </div>
      </div>

      <hr />

      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-4">{children}</div>
      </div>
    </>
  );
}
