import { publishEmbedWall, updateEmbedWall } from "@/actions/embed-wall";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { EmbedWallSchema } from "@/lib/schema.types";
import { BrickWallFire, Eye, MessageSquareText } from "lucide-react";
import { useState, useTransition } from "react";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";
import LoadingOverlay from "./_components/loading-overlay";
import PublishedDialog from "./_components/published-dialog";
import { defaultValue, tabs } from "./_lib/config";
import { useEmbedWallStore } from "./_lib/useEmbedWallStore";

export default function LayoutClient() {
  const { register, getValues } = useFormContext<EmbedWallSchema>();
  const published = useEmbedWallStore((state) => state.published);
  const setPublished = useEmbedWallStore((state) => state.setPublished);
  const id = useEmbedWallStore((state) => state.id);
  const slug = useEmbedWallStore((state) => state.slug);
  const responsesById = useEmbedWallStore((state) => state.responsesById);

  const [openPublishedDialog, setOpenPublishedDialog] = useState(false);

  const [isPublishing, startPublishEmbedWall] = useTransition();
  const handlePublish = () => {
    if (!id) return;

    startPublishEmbedWall(async () => {
      try {
        const { success, message } = await publishEmbedWall(id);
        if (!success) {
          toast.error(message);
          return;
        }
        setPublished();
        setOpenPublishedDialog(true);

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        toast.error("Oops! Something went wrong");
      }
    });
  };

  const handleUpdateEmbedWall = async () => {
    if (!id) return;

    const embedWallData = getValues();
    const { success } = await updateEmbedWall(id, embedWallData);
    if (!success) toast.error("Couldn't save");
  };

  const handlePreview = () => {
    const previewUrl = `/dashboard/${slug}/embed-wall/${id}/preview`;
    window.open(previewUrl);
  };

  const hasTestimonials = Object.values(responsesById).length > 0;

  return (
    <>
      <LoadingOverlay isLoading={isPublishing} />

      <div className="flex items-center justify-between border-t border-b px-4 py-3">
        <div className="flex items-center gap-3">
          <BrickWallFire />
          <div className="before:bg-ring relative before:absolute before:bottom-0 before:left-1/2 before:block before:h-px before:w-0 before:-translate-x-1/2 before:transition-all before:content-[''] focus-within:before:w-full">
            <input
              {...register("name")}
              type="text"
              className="selection:bg-primary selection:text-primary-foreground field-sizing-content h-9 max-w-120 min-w-40 px-1 transition-colors outline-none"
              placeholder="Untitled wall"
              onBlur={() => handleUpdateEmbedWall()}
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-lg"
                aria-label="preview"
                onClick={handlePreview}
                disabled={!hasTestimonials}
              >
                <Eye className="size-6" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Preview</p>
            </TooltipContent>
          </Tooltip>
          {!published ? (
            <Button
              className="bg-theme-primary hover:bg-theme-primary/85 font-semibold"
              onClick={handlePublish}
              disabled={!hasTestimonials || isPublishing}
            >
              Publish
              {isPublishing && <Spinner />}
            </Button>
          ) : (
            <Button
              className="font-semibold"
              variant="outline"
              onClick={() => setOpenPublishedDialog(true)}
            >
              Published
            </Button>
          )}
        </div>
      </div>

      {hasTestimonials ? (
        <div className="mx-15 my-4">
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
      ) : (
        <div className="bg-card mx-15 my-4 flex flex-col items-center rounded-lg p-7">
          <MessageSquareText className="text-muted-foreground size-10" />
          <div className="mt-4 space-y-1 text-center">
            <h3>No testimonials yet</h3>
            <p className="text-muted-foreground text-sm">
              At the moment, there are no testimonials to display on your embed
              wall.
            </p>
          </div>
        </div>
      )}

      <PublishedDialog
        id={id}
        open={openPublishedDialog}
        handleOpenChange={setOpenPublishedDialog}
      />
    </>
  );
}
