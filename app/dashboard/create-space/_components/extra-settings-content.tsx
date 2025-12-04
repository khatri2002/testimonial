import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Controller, useFormContext } from "react-hook-form";
import { CreateSpaceSchema } from "../_lib/schema.types";

export default function ExtraSettingsContent() {
  const { control } = useFormContext<CreateSpaceSchema>();

  return (
    <>
      <h2 className="my-3 text-center text-3xl font-medium">Extra Settings</h2>
      <FieldSet>
        <FieldGroup>
          <Controller
            control={control}
            name="extra_settings.send_btn_text"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="extra_settings.send_btn_text">
                  Send button text
                </FieldLabel>
                <Input
                  {...field}
                  id="extra_settings.send_btn_text"
                  aria-invalid={fieldState.invalid}
                  placeholder="Send"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            control={control}
            name="extra_settings.max_testimonial_chars"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="extra_settings.max_testimonial_chars">
                  Max characters for testimonial
                </FieldLabel>
                <Input
                  {...field}
                  id="extra_settings.max_testimonial_chars"
                  aria-invalid={fieldState.invalid}
                  type="number"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            control={control}
            name="extra_settings.consent_field_mode"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="extra_settings.consent_field_mode">
                  Consent Display
                </FieldLabel>
                <Select
                  value={field.value}
                  onValueChange={(value) => field.onChange(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="required">Required</SelectItem>
                      <SelectItem value="optional">Optional</SelectItem>
                      <SelectItem value="hidden">Hidden</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            control={control}
            name="extra_settings.consent_text"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="extra_settings.consent_text">
                  Consent Statement
                </FieldLabel>
                <Textarea
                  {...field}
                  id="extra_settings.consent_text"
                  aria-invalid={fieldState.invalid}
                  placeholder="I give permission to use this testimonial across social channels and other marketing efforts"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            control={control}
            name="extra_settings.verify_submitted_email"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="extra_settings.verify_submitted_email">
                  Verify Submitter Email
                </FieldLabel>
                <div>
                  <Switch
                    id="extra_settings.verify_submitted_email"
                    checked={field.value}
                    onCheckedChange={(checked) => field.onChange(checked)}
                  />
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            control={control}
            name="extra_settings.theme"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="extra_settings.theme">Theme</FieldLabel>
                <Select
                  value={field.value}
                  onValueChange={(value) => field.onChange(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>
      </FieldSet>
    </>
  );
}
