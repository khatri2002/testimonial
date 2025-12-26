import { Button } from "@/components/ui/button";
import { MessageSquareText, Pencil } from "lucide-react";
import Sidebar from "./_components/Sidebar";

interface SlugLayoutProps {
  children: React.ReactNode;
}

export default function SlugLayout({ children }: SlugLayoutProps) {
  return (
    <>
      <div className="flex items-center justify-between px-5 py-7">
        <h2 className="text-xl font-medium">Test Space 1</h2>
        <div className="flex items-center gap-12">
          <div className="flex gap-2">
            <MessageSquareText size={17} className="mt-1" />
            <div className="flex flex-col">
              <span className="">Testimonials</span>
              <span className="text-muted-foreground">23</span>
            </div>
          </div>

          <Button>
            <Pencil />
            Edit Space
          </Button>
        </div>
      </div>

      <hr />

      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-4">{children}</div>
      </div>
    </>
  );
}
