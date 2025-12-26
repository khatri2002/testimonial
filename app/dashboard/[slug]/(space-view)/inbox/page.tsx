import { auth } from "@/app/auth";
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import InboxContentClient from "./_components/inbox-content-client";
import InboxContentSkeleton from "./_components/inbox-content-skeleton";

interface InboxProps {
  params: Promise<{ slug: string }>;
}

export default async function Inbox({ params }: InboxProps) {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) redirect("/sign-in");

  const { slug } = await params;
  const space = await prisma.space.findUnique({
    where: { slug, user: { email } },
  });
  if (!space) redirect("sign-in");

  return (
    <Suspense fallback={<InboxContentSkeleton />}>
      <InboxContent slug={slug} />
    </Suspense>
  );
}

interface InboxContentProps {
  slug: string;
}
async function InboxContent({ slug }: InboxContentProps) {
  const space = await prisma.space.findUnique({
    where: { slug },
    include: { responses: true },
  });
  if (!space) notFound();

  const { responses } = space;

  return <InboxContentClient responses={responses} />;
}
