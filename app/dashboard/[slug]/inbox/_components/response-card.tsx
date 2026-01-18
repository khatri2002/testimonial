"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Rating, RatingButton } from "@/components/ui/shadcn-io/rating";
import { format } from "date-fns";
import { Ellipsis } from "lucide-react";
import { useState } from "react";
import { TransformedResponse } from "../../_lib/types";
import ResponseCardMenuActions from "./response-card-menu-actions";
import ViewResponseDialog from "./view-response-dialog";

interface ResponseCardProps {
  response: TransformedResponse;
}

export default function ResponseCard({ response }: ResponseCardProps) {
  const { id, answers, submitted_at } = response;

  const [openViewResponseDialog, setOpenViewResponseDialog] = useState(false);

  return (
    <DropdownMenu>
      <div
        className="bg-card hover:bg-card/80 cursor-pointer space-y-4 rounded-lg border p-3 transition-colors"
        onClick={() => setOpenViewResponseDialog(true)}
      >
        <div className="flex items-center justify-between">
          <span>{answers.name.value}</span>
          <DropdownMenuTrigger asChild>
            <Button
              className="focus-visible:ring-0"
              variant="ghost"
              size="icon-sm"
              aria-label="menu"
            >
              <Ellipsis />
            </Button>
          </DropdownMenuTrigger>
        </div>
        <div className="flex items-end justify-between gap-10">
          <div className="lower-left">
            {answers.rating && (
              <Rating value={Number(answers.rating.value)} readOnly>
                {Array.from({ length: 5 }).map((_, index) => (
                  <RatingButton className="text-yellow-500" key={index} />
                ))}
              </Rating>
            )}
            <p className="text-muted-foreground line-clamp-2 text-sm">
              {answers.testimonial.value}
            </p>
          </div>
          <div className="flex flex-col text-right text-sm text-nowrap">
            <span>Submitted at</span>
            <span className="text-muted-foreground">
              {format(new Date(submitted_at), "MMM d, yyyy, h:mm a")}
            </span>
          </div>
        </div>
      </div>

      <ResponseCardMenuActions id={id} />
      <ViewResponseDialog
        response={response}
        open={openViewResponseDialog}
        handleOpenChange={setOpenViewResponseDialog}
      />
    </DropdownMenu>
  );
}
