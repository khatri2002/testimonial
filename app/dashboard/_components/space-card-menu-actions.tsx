"use client";

import { deleteSpace, duplicateSpace } from "@/actions/testimonial";
import {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner";
import { Check, Copy, LinkIcon, Pencil, Table, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { MouseEvent, useState, useTransition } from "react";
import { toast } from "sonner";
import ConfirmDeleteDialog from "./confirm-delete-dialog";

interface SpaceCardMenuProps {
  name: string;
  slug: string;
  id: string;
  handleMenuOpenChange: (open: boolean) => void;
}

export default function SpaceCardMenuActions({
  name,
  slug,
  id,
  handleMenuOpenChange,
}: SpaceCardMenuProps) {
  const router = useRouter();
  const domain = process.env.NEXT_PUBLIC_APP_URL;

  const [linkCopied, setLinkCopied] = useState(false);
  const [openConfirmDeleteDialog, setOpenConfirmDeleteDialog] = useState(false);

  const [isDuplicating, startDuplicateSpace] = useTransition();
  const [isDeleting, startDeleteSpace] = useTransition();

  const handleManageTestimonial = (e: MouseEvent) => {
    e.preventDefault();
    router.push(`/dashboard/${slug}`);
  };

  const handleGetLink = (e: MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(`${domain}/${slug}`);
    setLinkCopied(true);
    toast.success("Link copied to clipboard!");

    // reset the copied state after 2 seconds
    setTimeout(() => {
      setLinkCopied(false);
    }, 2000);
  };

  const handleEdit = (e: MouseEvent) => {
    e.preventDefault();
    router.push(`/dashboard/edit-space/${slug}`);
  };

  const handleDuplicate = (e: MouseEvent) => {
    e.preventDefault();
    startDuplicateSpace(async () => {
      try {
        const { success, message } = await duplicateSpace(id);
        if (!success) {
          toast.error(message);
          return;
        }
        toast.success("Space duplicated");
        handleMenuOpenChange(false);

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        toast.error("Oops! Something went wrong");
      }
    });
  };

  const handleDelete = () => {
    startDeleteSpace(async () => {
      try {
        const { success, message } = await deleteSpace(id);
        if (!success) {
          toast.error(message);
          return;
        }

        toast.success("Space deleted");
        setOpenConfirmDeleteDialog(false);
        handleMenuOpenChange(false);

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        toast.error("Oops! Something went wrong");
      }
    });
  };

  return (
    <>
      <DropdownMenuContent
        className="w-56"
        align="start"
        onClick={(e) => e.stopPropagation()}
      >
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="cursor-pointer gap-3"
            onClick={handleManageTestimonial}
            disabled={isDuplicating}
          >
            <Table />
            Manage testimonials
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer gap-3"
            onClick={handleGetLink}
            disabled={linkCopied || isDuplicating}
          >
            {linkCopied ? (
              <>
                <Check /> Copied
              </>
            ) : (
              <>
                <LinkIcon /> Get the link
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer gap-3"
            onClick={handleEdit}
            disabled={isDuplicating}
          >
            <Pencil />
            Edit the space
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer gap-3"
            onClick={handleDuplicate}
            disabled={isDuplicating}
          >
            {isDuplicating ? (
              <>
                <Spinner />
                Duplicating...
              </>
            ) : (
              <>
                <Copy />
                Duplicate the space
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem
            className="group hover:bg-destructive! cursor-pointer gap-3"
            disabled={isDuplicating}
            onClick={(e) => {
              e.preventDefault();
              setOpenConfirmDeleteDialog(true);
            }}
          >
            <Trash className="text-muted-foreground group-hover:text-white" />
            Delete the space
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>

      <ConfirmDeleteDialog
        open={openConfirmDeleteDialog}
        handleOpenChange={(open) => setOpenConfirmDeleteDialog(open)}
        name={name}
        handleSubmit={handleDelete}
        isLoading={isDeleting}
      />
    </>
  );
}
