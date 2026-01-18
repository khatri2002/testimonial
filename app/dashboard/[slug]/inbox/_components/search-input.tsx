"use client";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { useSearchStore } from "../_lib/useSearchStore";

interface SearchInputProps {
  className?: string;
}

export default function SearchInput({ className }: SearchInputProps) {
  const query = useSearchStore((state) => state.query);
  const setQuery = useSearchStore((state) => state.setQuery);

  return (
    <InputGroup className={cn("w-full", className)}>
      <InputGroupInput
        placeholder="Search by name or keyword..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <InputGroupAddon>
        <Search />
      </InputGroupAddon>
    </InputGroup>
  );
}
