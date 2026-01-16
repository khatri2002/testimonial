"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useState } from "react";

interface ConfirmDeleteDialogProps {
  open: boolean;
  handleOpenChange: (open: boolean) => void;
  name: string;
  handleSubmit: () => void;
  isLoading?: boolean;
}

export default function ConfirmDeleteDialog({
  open,
  handleOpenChange,
  name,
  handleSubmit,
  isLoading,
}: ConfirmDeleteDialogProps) {
  const [nameValue, setNameValue] = useState("");

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <form
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <DialogHeader>
            <DialogTitle className="text-center">Delete this space</DialogTitle>
            <DialogDescription className="text-center">
              Once deleted, all testimonials in this space will be gone forever.
              <br />
              Please be certain!
            </DialogDescription>
          </DialogHeader>
          <div>
            <Field>
              <span className="text-sm">
                Type your space name{" "}
                <span className="text-destructive font-semibold">{name}</span>{" "}
                to confirm
              </span>
              <Input
                id="name"
                placeholder={name}
                value={nameValue}
                onChange={(e) => setNameValue(e.target.value)}
              />
            </Field>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              variant="destructive"
              className="w-full"
              disabled={name !== nameValue || isLoading}
            >
              Confirm Delete
              {isLoading && <Spinner />}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
