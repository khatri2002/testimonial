import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Response } from "@/prisma/app/generated/prisma/client";
import { CircleCheck } from "lucide-react";

interface ResponseDialogContentProps {
  response: Response["response"];
}

export default function ResponseDialogContent({
  response,
}: ResponseDialogContentProps) {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>View submitted response</DialogTitle>
        <DialogDescription>
          View the full details of the submitted response below.
        </DialogDescription>
      </DialogHeader>
      <div>
        {response && (
          <ul className="px-3">
            {Object.entries(response).map(([key, value], index) => (
              <li
                key={`field-${index}`}
                className="flex items-center gap-2 py-2 not-last:border-b"
              >
                <span className="text-muted-foreground text-sm">{key}:</span>
                <span>
                  {value === true ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <CircleCheck size={18} className="text-green-600" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          Checkbox field marked as <strong>Yes</strong>
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    value
                  )}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </DialogContent>
  );
}
