"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Prisma } from "@/prisma/src/generated/prisma/client";
import { Ellipsis } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import SpaceCardMenuActions from "./space-card-menu-actions";

interface SpaceCardProps {
  space: Prisma.SpaceGetPayload<{
    include: { _count: { select: { responses: true } } };
  }>;
}

export default function SpaceCard({ space }: SpaceCardProps) {
  const {
    id,
    name,
    slug,
    _count: { responses },
  } = space;

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
      <Link href={`/dashboard/${slug}`}>
        <div className="bg-card hover:bg-card/80 space-y-2 rounded-lg border p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <span>{name}</span>
            <DropdownMenuTrigger asChild>
              <Button
                className="focus-visible:ring-0"
                variant="ghost"
                size="icon-sm"
                aria-label="Menu"
              >
                <Ellipsis />
              </Button>
            </DropdownMenuTrigger>
          </div>
          <span className="text-muted-foreground text-sm">
            Testimonials - {responses}
          </span>
        </div>
      </Link>

      <SpaceCardMenuActions
        name={name}
        slug={slug}
        id={id}
        handleMenuOpenChange={setIsMenuOpen}
      />
    </DropdownMenu>
  );
}
