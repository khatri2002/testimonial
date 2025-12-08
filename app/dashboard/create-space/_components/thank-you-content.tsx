import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { CreateSpaceSchema } from "@/lib/schema/schema.types";
import { Trash } from "lucide-react";
import Image from "next/image";
import { useMemo, useRef } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";

export default function ThankYouContent() {
  const { control, watch, resetField } = useFormContext<CreateSpaceSchema>();

  const type = watch("thank_you.type");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const image = useWatch({ control, name: "thank_you.image" });
  const previewPhoto = useMemo(
    () => image && URL.createObjectURL(image),
    [image],
  );

  return (
    <>
      <h2 className="my-3 text-center text-3xl font-medium">
        Customize Thank You Pop-up
      </h2>
      <FieldSet>
        <FieldGroup>
          <Controller
            control={control}
            name="thank_you.type"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Post submission action</FieldLabel>
                <FieldGroup>
                  <RadioGroup
                    className="flex"
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <Label className="bg-muted has-checked:border-foreground hover:border-foreground/20 flex w-50 cursor-pointer flex-col rounded-md border border-transparent p-2">
                      <RadioGroupItem
                        value="display"
                        id="r1"
                        className="sr-only"
                      />
                      <span className="text-foreground">Display</span>
                      <span className="text-muted-foreground text-sm">
                        Display pop-up message
                      </span>
                    </Label>
                    <Label className="bg-muted has-checked:border-foreground hover:border-foreground/20 flex w-50 cursor-pointer flex-col rounded-md border border-transparent p-2">
                      <RadioGroupItem
                        value="redirect"
                        id="r2"
                        className="sr-only"
                      />
                      <span className="text-foreground">Redirect</span>
                      <span className="text-muted-foreground text-sm">
                        Redirect to URL
                      </span>
                    </Label>
                  </RadioGroup>
                </FieldGroup>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          {type === "display" && (
            <>
              <Controller
                control={control}
                name="thank_you.title"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="thank_you.title">Title</FieldLabel>
                    <Input
                      {...field}
                      id="thank_you.title"
                      aria-invalid={fieldState.invalid}
                      placeholder="Thank you for your response!"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                control={control}
                name="thank_you.message"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="thank_you.message">Message</FieldLabel>
                    <Textarea
                      {...field}
                      id="thank_you.message"
                      aria-invalid={fieldState.invalid}
                      placeholder="Thank you for taking your time out to submit the form. We really appreciate it."
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                control={control}
                name="thank_you.image"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="thank_you.image">Image</FieldLabel>
                    <div className="flex items-center gap-5">
                      <div className="bg-muted relative size-14 rounded">
                        {previewPhoto && (
                          <Image
                            src={previewPhoto}
                            fill
                            alt="thank-you-image"
                            className="rounded object-cover"
                            sizes="56px"
                          />
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          id="thank_you.image"
                          ref={fileInputRef}
                          type="file"
                          className="sr-only"
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
                          Change
                        </Button>
                        {previewPhoto && (
                          <Button
                            size="icon-sm"
                            variant="outline"
                            type="button"
                            onClick={() => resetField("thank_you.image")}
                          >
                            <Trash />
                          </Button>
                        )}
                      </div>
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </>
          )}
          {type === "redirect" && (
            <Controller
              control={control}
              name="thank_you.redirect_url"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="thank_you.redirect_url">
                    Redirect URL
                  </FieldLabel>
                  <Input
                    {...field}
                    id="thank_you.redirect_url"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          )}
        </FieldGroup>
      </FieldSet>
    </>
  );
}
