"use client";

import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface EditSpaceBtnProps {
  slug: string;
}

export default function EditSpaceBtn({ slug }: EditSpaceBtnProps) {
  const pathName = usePathname();
  console.log(pathName);

  const getSourceFrom = () => {
    if (pathName.includes("/inbox")) return "inbox";
    if (pathName.includes("/embed-wall")) return "embed-wall";
    return "dashboard";
  };

  return (
    <Link href={`/dashboard/edit-space/${slug}?from=${getSourceFrom()}`}>
      <Button className="bg-theme-primary hover:bg-theme-primary/85">
        <Pencil />
        Edit space
      </Button>
    </Link>
  );
}
