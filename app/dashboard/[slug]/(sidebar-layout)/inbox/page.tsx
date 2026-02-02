import { auth } from "@/auth";
import { notFound, redirect } from "next/navigation";
import { getSpace } from "../_lib/queries";
import { transformResponses } from "../_lib/utils";
import EmptyState from "./_components/empty-state";
import ResponseCards from "./_components/response-cards";
import SearchInput from "./_components/search-input";

interface SpaceInboxProps {
  params: Promise<{ slug: string }>;
}

export default async function SpaceInbox({ params }: SpaceInboxProps) {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) redirect("/sign-in");

  const { slug } = await params;

  const space = await getSpace(slug, email);
  if (!space) notFound();

  const { responses: rawResponses, fields } = space;
  const responses = transformResponses(rawResponses, fields);

  const hasResponses = responses.length > 0;

  return (
    <>
      {hasResponses && <SearchInput />}

      {hasResponses ? (
        <div className="mt-4">
          <ResponseCards responses={responses} />
        </div>
      ) : (
        <EmptyState slug={slug} />
      )}
    </>
  );
}
