import { auth } from "@/auth";
import { MessageSquareText } from "lucide-react";
import { notFound, redirect } from "next/navigation";
import { getSpace } from "../_lib/queries";
import { transformResponses } from "../_lib/utils";
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
        <div className="bg-card flex flex-col items-center rounded-lg p-7">
          <MessageSquareText className="text-muted-foreground size-10" />
          <div className="mt-4 space-y-1 text-center">
            <h3 className="text-lg">No testimonials yet</h3>
            <p className="text-muted-foreground text-sm">
              Testimonials submitted by your users will appear here.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
