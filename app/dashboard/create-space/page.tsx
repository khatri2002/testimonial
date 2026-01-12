"use client";

import { createNewSpace, isSlugAvailable } from "@/actions/testimonial";
import { Button } from "@/components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useDisableScroll from "@/lib/hooks/use-disable-scroll";
import { createSpaceSchema } from "@/lib/schema";
import { CreateSpaceSchema } from "@/lib/schema.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { useDebounce } from "use-debounce";
import BasicsTabContent from "./_components/basics-tab-content";
import ExtraSettingsContent from "./_components/extra-settings-content";
import LoadingOverlay from "./_components/loading-overlay";
import PromptsTabContent from "./_components/prompts-tab-content";
import ThankYouTabContent from "./_components/thank-you-tab-content";
import { generateSlug } from "./_lib/utils";

export default function CreateSpace() {
  useDisableScroll();

  const router = useRouter();

  const methods = useForm({
    resolver: zodResolver(createSpaceSchema),
    defaultValues: {
      basics: {
        name: "",
        slug: "",
        image: undefined,
        header_title: "",
        message: "",
        collect_star_rating: true,
        extra_information: [
          // TODO: maybe taken from some config
          {
            field_key: "name",
            label: "Name",
            type: "textbox",
            validations: { type: "string", required: true },
            category: "suggested",
            active: true,
            disabled: true,
          },
          {
            field_key: "email",
            label: "Email",
            type: "textbox",
            validations: { type: "email", required: true },
            category: "suggested",
            active: true,
            disabled: false,
          },
          {
            field_key: "company",
            label: "Company",
            type: "textbox",
            validations: { type: "string", required: false },
            category: "suggested",
            active: false,
            disabled: false,
          },
          {
            field_key: "title",
            label: "Title",
            type: "textbox",
            validations: { type: "string", required: false },
            category: "suggested",
            active: false,
            disabled: false,
          },
        ],
        dark_mode: true,
      },
      prompts: {
        question_label: "QUESTIONS",
        questions: [
          { question: "Who are you / what are you working on?" },
          { question: "How has [our product / service] helped you?" },
          { question: "What is the best thing about [our product / service]" },
        ],
      },
      thank_you_screen: {
        thank_you_title: "Thank you",
        thank_you_message:
          "Thank you for your shoutout! It means a ton for us!",
      },
      extra_settings: {
        max_testimonial_chars: "",
        send_btn_text: "Send",
        consent_display: "required",
        consent_statement:
          "I give permission to use this testimonial across social channels and other marketing efforts",
        verify_email: false,
      },
    },
    shouldFocusError: false,
  });
  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = methods;

  const [isCreating, startCreateSpace] = useTransition();

  const name = useWatch({ control, name: "basics.name" });
  const slug = useWatch({ control, name: "basics.slug" });
  const [debouncedSlug] = useDebounce(slug, 700);

  useEffect(() => {
    if (!name) return;

    const generatedSlug = generateSlug(name);
    setValue("basics.slug", generatedSlug, { shouldValidate: true });
  }, [name, setValue]);

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

    startSlugCheck(() => {
      isSlugAvailable(debouncedSlug).then((res) => setSlugAvailableRes(res));
    });
    lastCheckedSlug.current = debouncedSlug;
  }, [debouncedSlug, slugAvailability]);

  const onError = () => toast.error("Please fix all the errors in the form");

  const onSubmit = async (data: CreateSpaceSchema) => {
    if (!slugAvailableRes?.available) {
      toast.error(
        "The space URL slug is not available. Please choose another one.",
      );
      return;
    }

    startCreateSpace(async () => {
      const {
        basics: { image, ...restBasics },
        prompts,
        thank_you_screen,
        extra_settings,
      } = data;

      const fd = new FormData();
      fd.append("basics", JSON.stringify(restBasics));
      fd.append("prompts", JSON.stringify(prompts));
      fd.append("thank_you_screen", JSON.stringify(thank_you_screen));
      fd.append("extra_settings", JSON.stringify(extra_settings));
      fd.append("image", image);

      try {
        const { success, message } = await createNewSpace(fd);
        if (!success) {
          toast.error(message);
          return;
        }
        toast.success("Space created");
        router.push("/dashboard");

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        toast.error("Oops! Something went wrong");
      }
    });
  };

  return (
    <>
      <LoadingOverlay isLoading={isCreating} />
      <FormProvider {...methods}>
        <ResizablePanelGroup direction="horizontal" className="flex-[1_1_0]">
          <ResizablePanel defaultSize={50} className="overflow-y-auto! p-4">
            <form
              className="mx-auto w-md"
              onSubmit={handleSubmit(onSubmit, onError)}
            >
              <Tabs defaultValue="basics">
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
                    isCheckingSlug={isCheckingSlug}
                    slugAvailableRes={slugAvailableRes}
                    slugAvailability={slugAvailability}
                  />
                </TabsContent>
                <TabsContent value="prompts">
                  <PromptsTabContent />
                </TabsContent>
                <TabsContent value="thank_you_screen">
                  <ThankYouTabContent />
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
                Create new space
              </Button>
            </form>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={50} className="overflow-y-auto! p-4">
            preview
          </ResizablePanel>
        </ResizablePanelGroup>
      </FormProvider>
    </>
  );
}
