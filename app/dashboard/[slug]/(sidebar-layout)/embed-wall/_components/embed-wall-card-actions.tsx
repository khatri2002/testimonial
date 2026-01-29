"use client";

import { deleteEmbedWall } from "@/actions/embed-wall";
import {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Check, Copy, Trash } from "lucide-react";
import { MouseEvent, useState, useTransition } from "react";
import { toast } from "sonner";
import ConfirmDeleteDialog from "./confirm-delete-dialog";

interface EmbedWallCardActionsProps {
  id: string;
  published: boolean;
}

export default function EmbedWallCardActions({
  id,
  published,
}: EmbedWallCardActionsProps) {
  const domain = process.env.NEXT_PUBLIC_APP_URL;
  const embedCode = `<iframe
    id="testimonial-wall"
    src="${domain}/embed-wall/${id}"
    width="100%"
  ></iframe>`;

  const [copied, setCopied] = useState(false);
  const [openConfirmDeleteDialog, setOpenConfirmDeleteDialog] = useState(false);

  const [isDeleting, startDeleteEmbedWall] = useTransition();

  const handleCopy = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();

    navigator.clipboard.writeText(embedCode);
    setCopied(true);

    setTimeout(() => setCopied(false), 3000);
  };

  const handleDelete = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setOpenConfirmDeleteDialog(true);
  };

  const confirmDelete = () =>
    startDeleteEmbedWall(async () => {
      try {
        const { success, message } = await deleteEmbedWall(id);
        if (!success) {
          toast.error(message);
          return;
        }

        setOpenConfirmDeleteDialog(false);
        toast.success("Wall deleted");

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        toast.error("Oops! Something went wrong");
      }
    });

  return (
    <>
      <DropdownMenuContent align="start" className="w-52">
        <DropdownMenuGroup>
          {published && (
            <DropdownMenuItem
              className="flex cursor-pointer items-center gap-3"
              onClick={handleCopy}
              disabled={copied}
            >
              {copied ? (
                <>
                  <Check />
                  Copied
                </>
              ) : (
                <>
                  <Copy />
                  Copy embed code
                </>
              )}
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            className="hover:bg-destructive! group flex cursor-pointer items-center gap-3"
            onClick={handleDelete}
          >
            <Trash className="text-muted-foreground group-hover:text-white" />
            Delete wall
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
      <ConfirmDeleteDialog
        open={openConfirmDeleteDialog}
        handleOpenChange={setOpenConfirmDeleteDialog}
        confirmDelete={confirmDelete}
        isLoading={isDeleting}
      />
    </>
  );
}
