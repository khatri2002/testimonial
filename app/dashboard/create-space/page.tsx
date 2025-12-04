"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import TestimonialPagePreview from "@/components/(testimonial)/page/preview";
import RedirectPreview from "@/components/(testimonial)/redirect-preview";
import ThankYouDialogPreview from "@/components/(testimonial)/thank-you-dialog/preview";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import BasicContent from "./_components/basics-content";
import ExtraSettingsContent from "./_components/extra-settings-content";
import PromptsContent from "./_components/prompts-content";
import ThankYouContent from "./_components/thank-you-content";
import { createSpaceSchema } from "./_lib/schema";
import { CreateSpaceSchema } from "./_lib/schema.types";

export default function CreateSpace() {
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
  const { handleSubmit, control } = methods;

  const onSubmit = (data: CreateSpaceSchema) => console.log(data);

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

  return (
    <FormProvider {...methods}>
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={50} className="p-4">
          <form
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            className="mx-auto max-w-md"
          >
            <Tabs defaultValue="basics" value={tab} onValueChange={onTabChange}>
              <TabsList className="mx-auto">
                <TabsTrigger value="basics">Basics</TabsTrigger>
                <TabsTrigger value="prompts">Prompts</TabsTrigger>
                <TabsTrigger value="thank_you">Thank You Pop-up</TabsTrigger>
                <TabsTrigger value="extra_settings">Extra Settings</TabsTrigger>
              </TabsList>
              <TabsContent value="basics">
                <BasicContent />
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
  );
}
