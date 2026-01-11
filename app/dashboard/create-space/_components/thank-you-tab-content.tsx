import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CreateSpaceSchema } from "@/lib/schema.types";
import { Controller, useFormContext } from "react-hook-form";

export default function ThankYouTabContent() {
  const { control } = useFormContext<CreateSpaceSchema>();

  return (
    <div className="mt-1">
      <h2 className="mb-5 text-center text-lg">Customize thank you screen</h2>
      <FieldGroup className="mt-2">
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
