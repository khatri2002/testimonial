import { redirect } from "next/navigation";

interface SpacePageProps {
  params: Promise<{ slug: string }>;
}

export default async function SpacePage({ params }: SpacePageProps) {
  const { slug } = await params;
  redirect(`/dashboard/${slug}/inbox`);
}
