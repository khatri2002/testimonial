"use client";

import { handleSignOutAction } from "@/actions/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";
import Image from "next/image";

interface UserMenuProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export default function UserMenu({ user }: UserMenuProps) {
  const { name, email, image } = user;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {image ? (
          <Image
            src={image}
            alt="user"
            width={36}
            height={36}
            className="size-8 cursor-pointer rounded-full sm:size-9"
          />
        ) : (
          <span className="bg-muted-foreground flex size-9 cursor-pointer items-center justify-center rounded-full">
            {name?.charAt(0) || email?.charAt(0).toUpperCase()}
          </span>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-50">
        <div className="text-center">
          {name && (
            <DropdownMenuLabel className="pb-0">{name}</DropdownMenuLabel>
          )}
          <DropdownMenuLabel className="text-muted-foreground">
            {email}
          </DropdownMenuLabel>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={async () => {
              await handleSignOutAction();
            }}
          >
            Logout
            <DropdownMenuShortcut>
              <LogOut />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
