import { redirect } from "next/navigation";

interface EmbedWallProps {
  params: Promise<{ slug: string; id: string }>;
}

export default async function EmbedWall({ params }: EmbedWallProps) {
  const { slug, id } = await params;
  redirect(`/dashboard/${slug}/embed-wall/${id}/edit`);
}
