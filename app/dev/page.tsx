"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useState } from "react";

export default function Dev() {
  const [openMenu, setOpenMenu] = useState(true);
  const [openDialog1, setOpenDialog1] = useState(false);
  const [openDialog2, setOpenDialog2] = useState(false);

  return (
    <>
      <Link href="/" className="bg-red-700!">
        <h2>Card content goes here</h2>

        <Button
          variant="outline"
          onClick={(e) => {
            e.preventDefault();
            setOpenMenu(true);
          }}
        >
          open
        </Button>
      </Link>

      <DropdownMenu open={openMenu} onOpenChange={setOpenMenu}>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setOpenDialog1(true)}>
            dialog-1
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpenDialog2(true)}>
            dialog-2
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={openDialog1} onOpenChange={setOpenDialog1}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>dialog-1</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog open={openDialog2} onOpenChange={setOpenDialog2}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>dialog-2</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
