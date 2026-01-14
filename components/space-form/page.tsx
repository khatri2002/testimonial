"use client";

import { isSlugAvailable } from "@/actions/testimonial";
import useDisableScroll from "@/lib/hooks/use-disable-scroll";
import { spaceSchema } from "@/lib/schema";
import { SpaceSchema } from "@/lib/schema.types";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState, useTransition } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { useDebounce } from "use-debounce";
import { Button } from "../ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import LoadingOverlay from "./_components/loading-overlay";
import PagePreview from "./_components/preview/page-preview";
import ThankYouScreenPreview from "./_components/preview/thank-you-screen-preview";
import BasicsTabContent from "./_components/tab-content/basics-tab-content";
import ExtraSettingsContent from "./_components/tab-content/extra-settings-content";
import PromptsTabContent from "./_components/tab-content/prompts-tab-content";
import ThankYouTabContent from "./_components/tab-content/thank-you-tab-content";
import { generateSlug } from "./_lib/utils";

interface BaseProps {
  defaultValues: SpaceSchema;
  onSubmit: (data: SpaceSchema) => void;
  isLoading: boolean;
}

interface CreateSpaceProps extends BaseProps {
  mode: "create";
}

interface EditSpaceProps extends BaseProps {
  mode: "edit";
  previewImages: {
    image?: string;
    thankYouImage?: string;
  };
  storedSlug: string;
}

type SpaceFormProps = CreateSpaceProps | EditSpaceProps;

export default function SpaceForm(props: SpaceFormProps) {
  const { mode, defaultValues, onSubmit, isLoading } = props;
  let imageUrl, thankYouImageUrl, storedSlug: string | undefined;
  if (mode === "edit") {
    const {
      previewImages: { image, thankYouImage },
      storedSlug: storedSlugTemp,
    } = props;
    imageUrl = image;
    thankYouImageUrl = thankYouImage;
    storedSlug = storedSlugTemp;
  }

  const [previewImage, setPreviewImage] = useState<string | undefined>(
    imageUrl,
  );
  const [previewThankYouImage, setPreviewThankYouImage] = useState<
    string | undefined
  >(thankYouImageUrl);

  useDisableScroll();

  const methods = useForm({
    resolver: zodResolver(spaceSchema),
    defaultValues,
    shouldFocusError: false,
  });
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = methods;

  const [activeTab, setActiveTab] = useState("basics");

  const { name, slug, dark_mode } = useWatch({ control, name: "basics" });
  const [debouncedSlug] = useDebounce(slug, 700);

  useEffect(() => {
    if (!name || mode === "edit") return;

    const generatedSlug = generateSlug(name);
    setValue("basics.slug", generatedSlug, { shouldValidate: true });
  }, [mode, name, setValue]);

  const [isCheckingSlug, startSlugCheck] = useTransition();
  const [slugAvailableRes, setSlugAvailableRes] = useState<{
    success: boolean;
    available?: boolean;
  } | null>(null);

  const slugAvailability = !!debouncedSlug && !errors.basics?.slug; // only check availability if slug is valid
  const lastCheckedSlug = useRef<string | null>(null);
  useEffect(() => {
    if (!slugAvailability) return;
    if (lastCheckedSlug.current === debouncedSlug) return;
    if (mode === "edit" && debouncedSlug === storedSlug) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSlugAvailableRes({ success: true, available: true });
      return;
    }

    startSlugCheck(() => {
      isSlugAvailable(debouncedSlug).then((res) => setSlugAvailableRes(res));
    });
    lastCheckedSlug.current = debouncedSlug;
  }, [debouncedSlug, mode, slugAvailability, storedSlug]);

  const onError = () => toast.error("Please fix all the errors in the form");
  const onSubmit_ = (data: SpaceSchema) => {
    if (!slugAvailableRes?.available) {
      toast.error(
        "The space URL slug is not available. Please choose another one.",
      );
      return;
    }

    onSubmit(data);
  };

  return (
    <>
      <LoadingOverlay
        isLoading={isLoading}
        loadingText={
          mode === "create" ? "Creating space..." : "Editing space..."
        }
      />
      <FormProvider {...methods}>
        <ResizablePanelGroup direction="horizontal" className="flex-[1_1_0]">
          <ResizablePanel defaultSize={50} className="overflow-y-auto! p-4">
            <form
              className="mx-auto w-md"
              onSubmit={handleSubmit(onSubmit_, onError)}
            >
              <Tabs
                defaultValue="basics"
                value={activeTab}
                onValueChange={(val) => setActiveTab(val)}
              >
                <div className="flex justify-center">
                  <TabsList>
                    <TabsTrigger value="basics">Basics</TabsTrigger>
                    <TabsTrigger value="prompts">Prompts</TabsTrigger>
                    <TabsTrigger value="thank_you_screen">
                      Thank you screen
                    </TabsTrigger>
                    <TabsTrigger value="extra_settings">
                      Extra settings
                    </TabsTrigger>
                  </TabsList>
                </div>
                <TabsContent value="basics">
                  <BasicsTabContent
                    previewImage={previewImage}
                    handleSetPreviewImage={(image) => setPreviewImage(image)}
                    isCheckingSlug={isCheckingSlug}
                    slugAvailableRes={slugAvailableRes}
                    slugAvailability={slugAvailability}
                  />
                </TabsContent>
                <TabsContent value="prompts">
                  <PromptsTabContent />
                </TabsContent>
                <TabsContent value="thank_you_screen">
                  <ThankYouTabContent
                    previewThankYouImage={previewThankYouImage}
                    handleSetPreviewThankYouImage={(image) =>
                      setPreviewThankYouImage(image)
                    }
                  />
                </TabsContent>
                <TabsContent value="extra_settings">
                  <ExtraSettingsContent />
                </TabsContent>
              </Tabs>
              <Button
                type="submit"
                className="bg-theme-primary hover:bg-theme-primary/85 mt-8 w-full font-bold"
                disabled={isCheckingSlug}
              >
                {mode === "create" ? "Create new space" : "Edit space"}
              </Button>
            </form>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel
            defaultSize={50}
            className={cn("bg-background @container overflow-y-auto! p-4", {
              dark: dark_mode,
              light: !dark_mode,
            })}
          >
            {activeTab === "thank_you_screen" ? (
              <ThankYouScreenPreview
                previewThankYouImage={previewThankYouImage}
              />
            ) : (
              <PagePreview previewImage={previewImage} />
            )}
          </ResizablePanel>
        </ResizablePanelGroup>
      </FormProvider>
    </>
  );
}
