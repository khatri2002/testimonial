"use client";

import { deleteTestimonial } from "@/actions/testimonial";
import {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Trash } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import ConfirmDeleteDialog from "./confirm-delete-dialog";

interface ResponseCardMenuActionsProps {
  id: string;
}

export default function ResponseCardMenuActions({
  id,
}: ResponseCardMenuActionsProps) {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const [isDeleting, startDeleteTestimonial] = useTransition();

  const handleDelete = () => {
    startDeleteTestimonial(async () => {
      try {
        const { success, message } = await deleteTestimonial(id);
        if (!success) {
          toast.error(message);
          return;
        }

        toast.success("Testimonial deleted");
        setOpenDeleteDialog(false);

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
            className="hover:bg-destructive! group cursor-pointer gap-3"
            onClick={() => setOpenDeleteDialog(true)}
            disabled={false}
          >
            <Trash className="text-muted-foreground group-hover:text-white" />
            Delete testimonial
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>

      <ConfirmDeleteDialog
        open={openDeleteDialog}
        handleOpenChange={setOpenDeleteDialog}
        handleConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </>
  );
}
