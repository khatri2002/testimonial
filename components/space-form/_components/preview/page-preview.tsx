import { Button } from "@/components/ui/button";
import { SpaceSchema } from "@/lib/schema.types";
import { Send } from "lucide-react";
import Image from "next/image";
import { useFormContext } from "react-hook-form";

interface PagePreviewProps {
  previewImage?: string;
}

export default function PagePreview({ previewImage }: PagePreviewProps) {
  const { watch } = useFormContext<SpaceSchema>();
  const {
    basics: { header_title, message },
    prompts: { question_label, questions },
    extra_settings: { send_btn_text },
  } = watch();

  return (
    <div className="mx-auto flex max-w-140 min-w-93.75 flex-col items-center">
      {previewImage && (
        <Image
          src={previewImage}
          width={0}
          height={0}
          alt="space-image-preview"
          sizes="100vw"
          className="h-auto w-full rounded"
        />
      )}
      <h1 className="text-foreground mt-5 text-center text-3xl leading-8 font-bold @sm:mt-10 @sm:text-5xl @sm:leading-14">
        {header_title || "Header title goes here..."}
      </h1>
      <p className="text-muted-foreground my-5 text-center whitespace-pre-line sm:my-8 sm:text-lg">
        {message || "Message goes here..."}
      </p>
      {questions.length > 0 && (
        <div className="self-start">
          <span className="before:bg-theme-primary text-foreground relative before:absolute before:-bottom-3 before:h-1 before:w-1/2 before:rounded-[1px] before:content-['']">
            {question_label}
          </span>
          <ul className="text-muted-foreground mt-6 list-disc pl-4 text-sm @sm:text-base">
            {questions.map(({ question }, index) => (
              <li key={`question-${index}`}>{question}</li>
            ))}
          </ul>
        </div>
      )}
      <div className="mt-10 @sm:mt-20">
        <Button className="bg-theme-primary hover:bg-theme-primary/85 active:outline-theme-primary/50 h-9 font-semibold outline-1 outline-offset-3 outline-transparent outline-solid active:translate-y-0.5 @sm:h-11 @sm:text-lg">
          {send_btn_text}
          <Send className="size-4 sm:size-5" />
        </Button>
      </div>
    </div>
  );
}
