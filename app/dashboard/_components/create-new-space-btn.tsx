import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

interface CreateNewSpaceBtnProps {
  className?: string;
}

export default function CreateNewSpaceBtn({
  className,
}: CreateNewSpaceBtnProps) {
  return (
    <Link href="/dashboard/create-space" className={className}>
      <Button className="bg-theme-primary hover:bg-theme-primary/85">
        <Plus />
        Create a new space
      </Button>
    </Link>
  );
}
