"use client";

import { deleteSpace, duplicateSpace } from "@/actions/testimonial";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { Prisma } from "@/prisma/app/generated/prisma/client";
import {
  Check,
  ClipboardList,
  Copy,
  Ellipsis,
  Link2,
  Pencil,
  Trash,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MouseEvent, useState } from "react";
import { toast } from "sonner";

interface SpaceCardProps {
  space: Prisma.SpaceGetPayload<{
    include: {
      _count: { select: { responses: true } };
    };
  }>;
}

export function SpaceCard({ space }: SpaceCardProps) {
  const {
    id,
    name,
    slug,
    _count: { responses },
  } = space;

  const router = useRouter();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleManageTestimonial = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    router.push(`/dashboard/${slug}/inbox`);
  };

  const handleEditSpace = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    // router.push(`/dashboard/${slug}/edit-space`);
    console.log("edit space");
  };

  const [copied, setCopied] = useState(false);
  const handleGetLink = async (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    const link = `${appUrl}/${slug}`;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);

      // reset the "Copied!" message after 2 seconds
      setTimeout(() => setCopied(false), 2000);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  const [isDuplicating, setIsDuplicating] = useState(false);
  const handleDuplicate = async (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDuplicating(true);
    try {
      const { success, message } = await duplicateSpace(id);
      if (!success) {
        toast.error(message);
        return;
      }
      toast.success(message);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast.error("Oops! Something went wrong.");
    } finally {
      setIsDuplicating(false);
      setIsMenuOpen(false);
    }
  };

  const [isDeleting, setIsDeleting] = useState(false);
  const handleDelete = async (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDeleting(true);
    try {
      const { success, message } = await deleteSpace(id);
      if (!success) {
        toast.error(message);
        return;
      }
      toast.success(message);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast.error("Oops! Something went wrong.");
    } finally {
      setIsDeleting(false);
      setIsMenuOpen(false);
    }
  };

  return (
    <Link
      href={`dashboard/${slug}/inbox`}
      onClick={(e) => (isDuplicating || isDeleting) && e.preventDefault()} // Prevent navigation when duplicating or deleting
    >
      <div className="bg-muted hover:bg-muted/80 space-y-6 rounded-md border p-4">
        <div className="flex items-center justify-between">
          <h4>{name}</h4>
          <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <DropdownMenuTrigger asChild>
              <button
                className="hover:text-muted-foreground cursor-pointer rounded p-1 transition-colors outline-none"
                onClick={(e) => {
                  e.preventDefault();
                  setIsMenuOpen(true);
                }}
              >
                <Ellipsis size={18} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={handleManageTestimonial}
                  disabled={isDuplicating || isDeleting}
                >
                  <ClipboardList />
                  <span>Manage testimonials</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleEditSpace}
                  disabled={isDuplicating || isDeleting}
                >
                  <Pencil />
                  <span>Edit space</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleGetLink}
                  disabled={isDuplicating || isDeleting}
                >
                  {copied ? <Check /> : <Link2 />}
                  <span>{copied ? "Copied!" : "Get the link"}</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleDuplicate}
                  disabled={isDuplicating || isDeleting}
                >
                  {isDuplicating ? <Spinner /> : <Copy />}
                  <span>
                    {isDuplicating ? "Duplicating..." : "Duplicate the space"}
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="hover:bg-destructive! group"
                  disabled={isDuplicating || isDeleting}
                  onClick={handleDelete}
                >
                  {isDeleting ? (
                    <Spinner />
                  ) : (
                    <Trash className="text-muted-foreground group-hover:text-foreground" />
                  )}
                  <span>{isDeleting ? "Deleting..." : "Delete the space"}</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <span className="text-muted-foreground text-sm">
          Testimonials: {responses}
        </span>
      </div>
    </Link>
  );
}

export function SpaceCardsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
      {[...Array(3)].map((_, id) => (
        <Skeleton key={id} className="h-27" />
      ))}
    </div>
  );
}
