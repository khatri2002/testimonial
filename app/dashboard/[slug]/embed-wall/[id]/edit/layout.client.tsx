import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { BrickWallFire, Eye } from "lucide-react";
import { defaultValue, tabs } from "./_lib/config";

export default function LayoutClient() {
  return (
    <>
      <div className="flex items-center justify-between border-t border-b px-4 py-3">
        <div className="flex items-center gap-3">
          <BrickWallFire />
          <div className="before:bg-ring relative before:absolute before:bottom-0 before:left-1/2 before:block before:h-px before:w-0 before:-translate-x-1/2 before:transition-all before:content-[''] focus-within:before:w-full">
            <input
              type="text"
              className="selection:bg-primary selection:text-primary-foreground field-sizing-content h-9 max-w-120 min-w-40 px-1 transition-colors outline-none"
              // value="Veronica wall"
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon-lg" aria-label="preview">
                <Eye className="size-6" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Preview</p>
            </TooltipContent>
          </Tooltip>
          <Button className="bg-theme-primary hover:bg-theme-primary/85 font-semibold">
            Publish
          </Button>
        </div>
      </div>
      <div className="m-4 mx-auto max-w-7xl">
        <Tabs defaultValue={defaultValue}>
          <TabsList className="mx-auto">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {tabs.map((tab) => (
            <TabsContent key={tab.value} value={tab.value}>
              <div className="p-2">{<tab.content />}</div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </>
  );
}
