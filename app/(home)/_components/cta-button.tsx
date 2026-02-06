import { Button } from "@/components/ui/button";
import Link from "next/link";

interface CTAButtonProps {
  href: string;
  children: React.ReactNode;
}
export default function CTAButton({ href, children }: CTAButtonProps) {
  return (
    <Link href={href}>
      <Button className="bg-theme-primary hover:bg-theme-primary/85 px-6 py-5 text-lg font-semibold hover:scale-104">
        {children}
      </Button>
    </Link>
  );
}
