"use client";

import { createNewSpace } from "@/actions/testimonial";
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
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import BasicsTabContent from "./_components/basics-tab-content";
import ExtraSettingsContent from "./_components/extra-settings-content";
import PromptsTabContent from "./_components/prompts-tab-content";
import ThankYouTabContent from "./_components/thank-you-tab-content";

export default function CreateSpace() {
  useDisableScroll();

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
  const { handleSubmit } = methods;

  const onError = () => toast.error("Please fix all the errors in the form");

  const onSubmit = async (data: CreateSpaceSchema) => {
    const { basics, prompts, thank_you_screen, extra_settings } = data;
    const { image } = basics;

    const fd = new FormData();
    fd.append("basics", JSON.stringify(basics));
    fd.append("prompts", JSON.stringify(prompts));
    fd.append("thank_you_screen", JSON.stringify(thank_you_screen));
    fd.append("extra_settings", JSON.stringify(extra_settings));
    fd.append("image", image);

    try {
      const res = await createNewSpace(fd);
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  };

  return (
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
              {/* <div className="mx-auto min-w-md"> */}
              <TabsContent value="basics">
                <BasicsTabContent />
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
              {/* </div> */}
            </Tabs>
            <Button
              type="submit"
              className="bg-theme-primary hover:bg-theme-primary/85 mt-8 w-full font-bold"
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
  );
}
