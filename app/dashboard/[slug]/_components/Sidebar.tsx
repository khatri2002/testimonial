"use client";

import { cn } from "@/lib/utils";
import { Inbox, Wallpaper } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  {
    label: "Inbox",
    href: "/dashboard/test-space-1/inbox",
    Icon: Inbox,
  },
  {
    label: "Embed Wall",
    href: "/dashboard/test-space-1/embed-wall",
    Icon: Wallpaper,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-90 p-4">
      <ul className="space-y-1">
        {NAV_ITEMS.map(({ label, href, Icon }, index) => (
          <li key={`item-${index}`}>
            <Link href={href}>
              <button
                className={cn(
                  "hover:bg-muted flex w-full cursor-pointer items-center gap-2 rounded-md p-2 transition-colors",
                  {
                    "bg-muted": pathname === href,
                  },
                )}
              >
                <Icon size={18} />
                {label}
              </button>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
