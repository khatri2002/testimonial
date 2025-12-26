import { deleteResponse } from "@/actions/testimonial";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner";
import { Response } from "@/prisma/app/generated/prisma/client";
import { format } from "date-fns";
import { EllipsisVertical, Trash, UserRound } from "lucide-react";
import { MouseEvent, useState } from "react";
import { toast } from "sonner";
import ResponseDialogContent from "./response-dialog-content";

interface ResponseCardProps {
  response: Response;
}

export default function ResponseCard({ response }: ResponseCardProps) {
  const { Name: name, Testimonial: testimonial } = response.response as {
    Name: string;
    Testimonial: string;
  };

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [isDeleting, setIsDeleting] = useState(false);
  const handleDelete = async (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();

    setIsDeleting(true);
    try {
      const { success, message } = await deleteResponse(response.id);
      if (!success) {
        toast.error(message);
        return;
      }
      toast.success(message);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast.error("Oops! Something went wrong");
    } finally {
      setIsDeleting(false);
      setIsMenuOpen(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild onClick={(e) => isDeleting && e.preventDefault()}>
        <div className="bg-muted hover:bg-muted/80 cursor-pointer space-y-6 rounded-md border p-3 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-muted-foreground flex size-8 items-center justify-center rounded-full">
                <UserRound size={20} />
              </div>
              <span>{name}</span>
            </div>
            <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <DropdownMenuTrigger asChild>
                <button className="hover:text-muted-foreground cursor-pointer outline-none">
                  <EllipsisVertical size={18} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="start">
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    className="hover:bg-destructive! group"
                    onClick={handleDelete}
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <Spinner />
                    ) : (
                      <Trash className="text-muted-foreground group-hover:text-foreground" />
                    )}
                    <span>
                      {isDeleting ? "Deleting..." : "Delete the response"}
                    </span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground line-clamp-2 w-2/3 text-sm">
              {testimonial}
            </span>
            <div className="flex flex-col text-sm">
              <span>Submitted at</span>
              <span className="text-muted-foreground">
                {format(response.submittedAt, "MMM dd, yyyy, hh:mm a")}
              </span>
            </div>
          </div>
        </div>
      </DialogTrigger>
      <ResponseDialogContent response={response.response} />
    </Dialog>
  );
}
