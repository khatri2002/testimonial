"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { useSearchStore } from "../lib/useSearchStore";

interface SearchInputProps {
  className?: string;
}
export default function SearchInput({ className }: SearchInputProps) {
  const query = useSearchStore((state) => state.query);
  const setQuery = useSearchStore((state) => state.setQuery);

  return (
    <div
      className={cn(
        className,
        "focus-within:outline-ring focus-within:ring-ring/50 bg-muted flex items-center rounded-md border outline-[1.5px] outline-transparent transition-all",
      )}
    >
      <div className="flex size-10 items-center justify-center">
        <Search size={18} />
      </div>
      <Input
        value={query}
        className="border-none bg-transparent! px-1 text-base! focus-visible:ring-0"
        placeholder="Search testimonials by name"
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  );
}
