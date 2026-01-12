import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CreateSpaceSchema } from "@/lib/schema.types";
import { Trash } from "lucide-react";
import Image from "next/image";
import { useMemo, useRef } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";

export default function ThankYouTabContent() {
  const { control, resetField, trigger } = useFormContext<CreateSpaceSchema>();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const image = useWatch({ control, name: "thank_you_screen.thank_you_image" });
  const previewImage = useMemo(
    () => image && URL.createObjectURL(image),
    [image],
  );

  return (
    <div className="mt-1">
      <h2 className="mb-5 text-center text-lg">Customize thank you screen</h2>
      <FieldGroup className="mt-2">
        <Controller
          name="thank_you_screen.thank_you_image"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="thank_you_screen.thank_you_image">
                Image
              </FieldLabel>
              <div className="flex items-center gap-4">
                <div className="bg-muted relative size-12 rounded-full">
                  {previewImage && (
                    <Image
                      src={previewImage}
                      alt=""
                      fill
                      className="rounded-full object-cover"
                    />
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  id="thank_you_screen.thank_you_image"
                  className="sr-only"
                  type="file"
                  accept=".jpg, .jpeg, .png"
                  onChange={(e) => {
                    const fileInput = e.target;
                    const file = fileInput.files?.[0];
                    field.onChange(file);

                    fileInput.value = ""; // reset the input value to allow re-uploading the same file
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Choose File
                </Button>
                {previewImage && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => {
                      resetField("thank_you_screen.thank_you_image");
                      trigger("thank_you_screen.thank_you_image");
                    }}
                  >
                    <Trash />
                  </Button>
                )}
              </div>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="thank_you_screen.thank_you_title"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="thank_you_screen.thank_you_title">
                Thank you title <span>*</span>
              </FieldLabel>
              <Input
                {...field}
                id="thank_you_screen.thank_you_title"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="thank_you_screen.thank_you_message"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="thank_you_screen.thank_you_message">
                Thank you message <span>*</span>
              </FieldLabel>
              <Textarea
                {...field}
                id="thank_you_screen.thank_you_message"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
    </div>
  );
}
