"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDebounce } from "use-debounce";

import { createSpace, slugExists } from "@/actions/testimonial";
import TestimonialPagePreview from "@/components/(testimonial)/page/preview";
import RedirectPreview from "@/components/(testimonial)/redirect-preview";
import ThankYouDialogPreview from "@/components/(testimonial)/thank-you-dialog/preview";
import { Button } from "@/components/ui/button";
import { createSpaceSchema } from "@/lib/schema/schema";
import { CreateSpaceSchema } from "@/lib/schema/schema.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import BasicContent from "./_components/basics-content";
import ExtraSettingsContent from "./_components/extra-settings-content";
import Loading from "./_components/loading";
import PromptsContent from "./_components/prompts-content";
import ThankYouContent from "./_components/thank-you-content";
import { SlugAlert } from "./_lib/types";

export default function CreateSpace() {
  const router = useRouter();

  const methods = useForm({
    resolver: zodResolver(createSpaceSchema),
    defaultValues: {
      basics: {
        name: "",
        slug: "",
        header: "",
        message: "",
        image: undefined,
        extra_fields_system: [
          {
            name: "name",
            label: "Name",
            disabled: true,
            include: true,
            required: true,
            type: "text",
          },
          {
            name: "email",
            label: "Email",
            disabled: false,
            include: false,
            required: false,
            type: "email",
          },
          {
            name: "title",
            label: "Title",
            disabled: false,
            include: false,
            required: false,
            type: "text",
          },
        ],
        collect_star_ratings: true,
        photo_field_mode: "optional",
      },
      prompts: {
        questions_label: "",
        questions: [
          { question: "Who are you / what are you working on?" },
          { question: "How has [our product / service] helped you?" },
          { question: "What is the best thing about [our product / service]" },
        ],
      },
      thank_you: {
        type: "display",
        title: "",
        message: "",
        image: undefined,
        redirect_url: "",
      },
      extra_settings: {
        send_btn_text: "",
        max_testimonial_chars: "",
        consent_field_mode: "required",
        consent_text: "",
        verify_submitted_email: false,
        theme: "dark",
      },
    },
  });
  const { handleSubmit, control, getFieldState } = methods;

  const [tab, setTab] = useState("basics");
  const onTabChange = (value: string) => {
    setTab(value);
  };

  const type = useWatch({ control, name: "thank_you.type" });

  const renderPreviewContent = () => {
    if (tab === "thank_you")
      return type === "display" ? (
        <ThankYouDialogPreview />
      ) : (
        <RedirectPreview />
      );

    return <TestimonialPagePreview />;
  };

  const [slugAlert, setSlugAlert] = useState<SlugAlert>({
    show: false,
    variant: null,
    message: "",
  });
  const slug = useWatch({ control, name: "basics.slug" });
  const [debouncedSlug] = useDebounce(slug, 500);
  useEffect(() => {
    const handleSlugExist = async (slug: string) => {
      const { invalid } = getFieldState("basics.slug");
      if (invalid || !slug) {
        setSlugAlert({ show: false, variant: null, message: "" });
        return;
      }

      const { success, exist } = await slugExists(slug);
      if (success) {
        if (exist)
          setSlugAlert({
            show: true,
            variant: "error",
            message: "This public URL is already taken.",
          });
        else
          setSlugAlert({
            show: true,
            variant: "success",
            message: "This public URL is available!",
          });
      }
    };

    handleSlugExist(debouncedSlug);
  }, [debouncedSlug, getFieldState]);

  const onError = () => {
    toast.error("Please fix the errors in the form.", {
      position: "bottom-center",
    });
  };

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: CreateSpaceSchema) => {
    if (!slugAlert.show) return;

    if (slugAlert.variant === "error") {
      toast.error(
        "The public URL is already taken. Please choose another one.",
        { position: "bottom-center" },
      );
      return;
    }

    setLoading(true);

    const fd = new FormData();
    const { basics, thank_you } = data;

    const basicsImage = basics.image;
    const thankYouImage = thank_you.image;

    const jsonData = {
      ...data,
      basics: { ...basics, image: undefined },
      thank_you: { ...thank_you, image: undefined },
    };

    fd.append("json", JSON.stringify(jsonData));
    if (basicsImage) fd.append("basicsImage", basicsImage);

    if (thankYouImage) fd.append("thankYouImage", thankYouImage);

    try {
      const { success, message } = await createSpace(fd);
      if (!success) {
        toast.error(message, { position: "bottom-center" });
        return;
      }

      toast.success("Space created successfully!", {
        position: "bottom-center",
      });
      router.push("/dashboard");

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast.error("Oops! Something went wrong.", { position: "bottom-center" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Loading show={loading} />
      <FormProvider {...methods}>
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={50} className="p-4">
            <form
              noValidate
              onSubmit={handleSubmit(onSubmit, onError)}
              className="mx-auto max-w-md"
            >
              <Tabs
                defaultValue="basics"
                value={tab}
                onValueChange={onTabChange}
              >
                <TabsList className="mx-auto">
                  <TabsTrigger value="basics">Basics</TabsTrigger>
                  <TabsTrigger value="prompts">Prompts</TabsTrigger>
                  <TabsTrigger value="thank_you">Thank You Pop-up</TabsTrigger>
                  <TabsTrigger value="extra_settings">
                    Extra Settings
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="basics">
                  <BasicContent slugAlert={slugAlert} />
                </TabsContent>
                <TabsContent value="prompts">
                  <PromptsContent />
                </TabsContent>
                <TabsContent value="thank_you">
                  <ThankYouContent />
                </TabsContent>
                <TabsContent value="extra_settings">
                  <ExtraSettingsContent />
                </TabsContent>
              </Tabs>
              <div className="mt-6 text-center">
                <Button type="submit">Save Space</Button>
              </div>
            </form>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={50}>
            {renderPreviewContent()}
          </ResizablePanel>
        </ResizablePanelGroup>
      </FormProvider>
    </>
  );
}
