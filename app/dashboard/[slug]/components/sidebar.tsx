"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BrickWallFire, Inbox } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  slug: string;
  className?: string;
}

export default function Sidebar({ slug, className }: SidebarProps) {
  const navItems = [
    { label: "Inbox", href: `/dashboard/${slug}/inbox`, icon: <Inbox /> },
    {
      label: "Embed wall",
      href: `/dashboard/${slug}/embed-wall`,
      icon: <BrickWallFire />,
    },
  ];

  const pathname = usePathname();

  return (
    <div className={cn("w-xs border-r", className)}>
      <ul className="space-y-1">
        {navItems.map(({ label, href, icon }, index) => (
          <li key={`item-${index}`}>
            <Link href={href}>
              <Button
                variant="ghost"
                className={cn("w-full justify-start", {
                  "bg-muted hover:bg-muted!": pathname === href,
                })}
              >
                {icon}
                {label}
              </Button>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
