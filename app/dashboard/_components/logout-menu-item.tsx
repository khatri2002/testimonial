"use client";

import { handleSignOutAction } from "@/actions/auth";
import {
  DropdownMenuItem,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";

export default function LogoutMenuItem() {
  return (
    <DropdownMenuItem onClick={handleSignOutAction}>
      Logout
      <DropdownMenuShortcut>
        <LogOut />
      </DropdownMenuShortcut>
    </DropdownMenuItem>
  );
}
