import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { SpaceSchema } from "@/lib/schema.types";
import { Controller, useFormContext } from "react-hook-form";

export default function ExtraSettingsContent() {
  const { control, trigger } = useFormContext<SpaceSchema>();

  return (
    <div className="mt-1">
      <h2 className="mb-5 text-center text-lg">Some extra settings</h2>
      <FieldGroup className="mt-2">
        <Controller
          name="extra_settings.max_testimonial_chars"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="extra_settings.max_testimonial_chars">
                Maximum characters for testimonial text
              </FieldLabel>
              <Input
                {...field}
                id="extra_settings.max_testimonial_chars"
                aria-invalid={fieldState.invalid}
                onChange={(e) => {
                  const value = e.target.value;

                  if (value === "" || /^\d+$/.test(value)) field.onChange(e);
                }}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="extra_settings.send_btn_text"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="extra_settings.send_btn_text">
                Send button text<span>*</span>
              </FieldLabel>
              <Input
                {...field}
                id="extra_settings.send_btn_text"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="extra_settings.consent_display"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="extra_settings.consent_display">
                Consent display<span>*</span>
              </FieldLabel>
              <Select
                value={field.value}
                onValueChange={(val) => {
                  field.onChange(val);
                  trigger("extra_settings.consent_statement"); // trigger validation for consent_statement when consent_display changes
                }}
              >
                <SelectTrigger className="w-45">
                  <SelectValue placeholder="Select display type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="required">Required</SelectItem>
                  <SelectItem value="optional">Optional</SelectItem>
                  <SelectItem value="hidden">Hidden</SelectItem>
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="extra_settings.consent_statement"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="extra_settings.consent_statement">
                Consent statement
              </FieldLabel>
              <Input
                {...field}
                id="extra_settings.consent_statement"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="extra_settings.verify_email"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="extra_settings.verify_email">
                Verify Submitter email
              </FieldLabel>
              <Switch
                id="basics.verify_email"
                className="data-[state=checked]:bg-theme-primary w-8!"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
    </div>
  );
}
