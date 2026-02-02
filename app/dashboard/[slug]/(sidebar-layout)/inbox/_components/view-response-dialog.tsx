import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Rating, RatingButton } from "@/components/ui/shadcn-io/rating";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TransformedResponse } from "../../_lib/types";

interface ViewResponseDialogProps {
  response: TransformedResponse;
  open: boolean;
  handleOpenChange: (open: boolean) => void;
}

export default function ViewResponseDialog({
  response,
  open,
  handleOpenChange,
}: ViewResponseDialogProps) {
  const answers = Object.values(response.answers).sort(
    (a, b) => a.position - b.position,
  );

  const renderValue = (answer: TransformedResponse["answers"][string]) => {
    const { type, value } = answer;

    switch (type) {
      case "textarea":
        return <span className="whitespace-pre-line">{value}</span>;

      case "textbox":
        return <span>{value}</span>;

      case "rating":
        return (
          <Rating value={Number(value)} readOnly>
            {Array.from({ length: 5 }).map((_, index) => (
              <RatingButton className="text-yellow-500" key={index} />
            ))}
          </Rating>
        );

      case "checkbox":
        return (
          <Tooltip>
            <TooltipTrigger asChild>
              <span>
                <Checkbox
                  checked={Boolean(value)}
                  className="pointer-events-none ring-0!"
                />
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p>{Boolean(value) ? "Checked" : "Unchecked"}</p>
            </TooltipContent>
          </Tooltip>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="max-w-2xl!"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-center">View Response</DialogTitle>
          <DialogDescription className="text-center">
            View the details of this response.
          </DialogDescription>
        </DialogHeader>
        <ul className="my-2 space-y-1.5 text-sm">
          {answers.map((answer, index) => (
            <li key={`answer-${index}`} className="flex gap-4">
              <span className="text-muted-foreground w-66">
                {answer.label}:
              </span>
              <div className="flex-1">{renderValue(answer)}</div>
            </li>
          ))}
        </ul>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" className="w-full">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
