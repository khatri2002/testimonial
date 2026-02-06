import { cn } from "@/lib/utils";

interface SectionTitleProps {
  children: React.ReactNode;
  className?: string;
}
export function SectionTitle({ children, className }: SectionTitleProps) {
  return (
    <h1
      className={cn(
        "text-center text-3xl font-bold sm:max-w-2xl sm:text-4xl lg:max-w-3xl lg:text-6xl",
        className,
      )}
    >
      {children}
    </h1>
  );
}

interface SectionDescriptionProps {
  children: React.ReactNode;
  className?: string;
}
export function SectionDescription({
  children,
  className,
}: SectionDescriptionProps) {
  return (
    <p
      className={cn(
        "text-muted-foreground text-center text-sm sm:max-w-3xl sm:text-base lg:max-w-4xl lg:text-lg",
        className,
      )}
    >
      {children}
    </p>
  );
}
