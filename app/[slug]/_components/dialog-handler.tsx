"use client";

import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useState } from "react";
import TestimonialDialogContent from "./testimonial-dialog";

export default function DialogHandler() {
  const [openTestimonialDialog, setOpenTestimonialDialog] = useState(false);

  return (
    <>
      <Button
        className="bg-theme-primary hover:bg-theme-primary/90 p-4 sm:p-5 sm:text-lg lg:p-6"
        onClick={() => setOpenTestimonialDialog(true)}
      >
        <span>Send Testimonial</span>
        <Send className="sm:ml-1" />
      </Button>
      <TestimonialDialogContent
        open={openTestimonialDialog}
        handleOpenChange={(open) => setOpenTestimonialDialog(open)}
        onSubmit={async (data) =>
          await new Promise((resolve) => setTimeout(resolve, 3000))
        }
      />
    </>
  );
}
