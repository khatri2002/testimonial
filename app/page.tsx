"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { addTest } from "./queries";

export default function Home() {
  const handleAddTest = async () => {
    try {
      await addTest();
      toast.success("Added");
    } catch (err) {
      console.log(`ERROR - ${err}`);
      toast.error("Failed to add");
    }
  };

  return <Button onClick={handleAddTest}>add test</Button>;
}
