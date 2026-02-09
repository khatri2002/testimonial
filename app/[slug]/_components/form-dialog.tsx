import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { Rating, RatingButton } from "@/components/ui/shadcn-io/rating";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FieldConfig, FieldValidations } from "@/lib/types";
import { buildTestimonialSchema } from "@/lib/utils";
import {
  Field as FieldType,
  Prisma,
} from "@/prisma/src/generated/prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Info } from "lucide-react";
import { Fragment, useImperativeHandle } from "react";
import { Controller, useForm } from "react-hook-form";
import DialogLoadingOverlay from "./dialog-loading-overlay";

export interface FormDialogRef {
  clearForm: () => void;
}

interface FormDialogProps {
  ref?: React.Ref<FormDialogRef>;
  space: Prisma.SpaceGetPayload<{ include: { fields: true } }>;
  open: boolean;
  handleOpenChange: (open: boolean) => void;
  onSubmit: (data: Record<string, unknown>) => void;
}

export default function FormDialog({
  ref,
  space,
  open,
  handleOpenChange,
  onSubmit,
}: FormDialogProps) {
  const { fields } = space;
  const { schema, defaultValues } = buildTestimonialSchema(fields);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues,
    shouldFocusError: false,
  });

  // expose clearForm method to parent via ref
  useImperativeHandle(ref, () => ({
    clearForm: () => reset(),
  }));

  const renderField = (field: FieldType) => {
    const {
      field_key,
      label,
      placeholder,
      type,
      config: rawConfig,
      validations: rawValidations,
    } = field;
    const config = rawConfig as FieldConfig;
    const validations = rawValidations as FieldValidations;

    switch (type) {
      case "rating":
        return (
          <Controller
            name={field_key}
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <div className="flex justify-center">
                  <Rating value={field.value} onValueChange={field.onChange}>
                    {Array.from({ length: 5 }).map((_, index) => (
                      <RatingButton
                        key={index}
                        className="text-theme-primary"
                      />
                    ))}
                  </Rating>
                </div>
                {fieldState.invalid && (
                  <FieldError
                    className="text-center"
                    errors={[fieldState.error]}
                  />
                )}
              </Field>
            )}
          />
        );

      case "textarea":
        return (
          <Controller
            name={field_key}
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <InputGroup>
                  <InputGroupTextarea
                    {...field}
                    id={field_key}
                    aria-invalid={fieldState.invalid}
                    placeholder={placeholder || undefined}
                    maxLength={
                      (config?.characterCounter?.enforceLimit &&
                        config.characterCounter.maxCharacters) ||
                      undefined
                    }
                    className="min-h-30!"
                  />
                  {config?.characterCounter?.enabled && (
                    <InputGroupAddon align="block-end">
                      <InputGroupText className="text-muted-foreground text-xs">
                        {field.value.length}/
                        {config.characterCounter.maxCharacters} characters
                      </InputGroupText>
                    </InputGroupAddon>
                  )}
                </InputGroup>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        );

      case "textbox":
        return (
          <Controller
            name={field_key}
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field_key} className="w-fit!">
                  {label}
                  {validations?.required && <span>*</span>}
                  {config?.info && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info
                          size={15}
                          className="text-foreground cursor-pointer"
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{config.info}</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </FieldLabel>

                <Input
                  {...field}
                  id={field_key}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        );

      case "checkbox":
        return (
          <Controller
            name={field_key}
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <div className="flex gap-3">
                  <Checkbox
                    id={field_key}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <FieldLabel htmlFor={field_key}>
                    {label} {validations?.required && "*"}
                  </FieldLabel>
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        );

      default:
        break;
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        onInteractOutside={(e) => isSubmitting && e.preventDefault()} // prevent closing dialog on outside click when submitting
        onEscapeKeyDown={(e) => isSubmitting && e.preventDefault()} // prevent closing dialog on escape key when submitting
        className="max-h-[90vh] overflow-y-auto"
      >
        <DialogLoadingOverlay isLoading={isSubmitting} />

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Write testimonial to Indigo</DialogTitle>
            <DialogDescription className="sr-only">
              Write testimonial to Indigo
            </DialogDescription>
          </DialogHeader>

          <FieldGroup className="gap-4">
            {fields.map((field) => (
              <Fragment key={field.id}>{renderField(field)}</Fragment>
            ))}
          </FieldGroup>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              type="submit"
              className="bg-theme-primary hover:bg-theme-primary/85"
            >
              Send
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
