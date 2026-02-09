import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Spinner } from "@/components/ui/spinner";
import { Trash2Icon } from "lucide-react";

interface ConfirmDeleteDialogProps {
  open: boolean;
  handleOpenChange: (open: boolean) => void;
  confirmDelete: () => void;
  isLoading?: boolean;
}

export default function ConfirmDeleteDialog({
  open,
  handleOpenChange,
  confirmDelete,
  isLoading,
}: ConfirmDeleteDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent size="sm" onOpenAutoFocus={(e) => e.preventDefault()}>
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <Trash2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>Delete wall?</AlertDialogTitle>
          <AlertDialogDescription>
            This will delete the embed wall and all of its data. This action
            cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={(e) => {
              e.preventDefault();
              confirmDelete();
            }}
            disabled={isLoading}
          >
            Delete
            {isLoading && <Spinner />}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
