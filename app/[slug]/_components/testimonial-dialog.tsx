import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import OverlayBlocker from "@/components/ui/overlay-blocker";
import { Rating, RatingButton } from "@/components/ui/shadcn-io/rating";
import { Spinner } from "@/components/ui/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FormField } from "@/lib/types";
import { buildForm } from "@/lib/utils";
import { Prisma } from "@/prisma/app/generated/prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Info, Trash } from "lucide-react";
import Image from "next/image";
import { Fragment, useImperativeHandle, useMemo, useRef } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { getDefaultValues } from "../_lib/utils";

export interface TestimonialDialogRef {
  clearForm: () => void;
}
interface TestimonialDialogProps {
  ref?: React.Ref<TestimonialDialogRef>;
  space: Prisma.SpaceGetPayload<{
    include: {
      spaceBasics: {
        include: {
          spaceBasicExtraFields: true;
        };
      };
      spaceExtraSettings: true;
    };
  }>;
  open: boolean;
  handleOpenChange: (open: boolean) => void;
  onSubmit: (data: Record<string, unknown>) => void;
}

export default function TestimonialDialog({
  ref,
  space,
  open,
  handleOpenChange,
  onSubmit,
}: TestimonialDialogProps) {
  const { fields, schema } = buildForm(space);
  const defaultValues = getDefaultValues(fields);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = form;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const photo = useWatch({ control, name: "photo" });
  const previewPhoto = useMemo(
    () => photo && URL.createObjectURL(photo),
    [photo],
  );

  // expose clearForm method to parent via ref
  useImperativeHandle(ref, () => ({
    clearForm: () => reset(),
  }));

  const renderField = (field: FormField) => {
    const { name, type, maxChars, placeholder, tooltip, label, required } =
      field;
    switch (type) {
      case "starRating":
        return (
          <Controller
            control={control}
            name={name}
            render={({ field, fieldState }) => (
              <Field>
                <Rating
                  value={field.value}
                  onValueChange={field.onChange}
                  className="justify-center"
                >
                  {Array.from({ length: 5 }).map((_, index) => (
                    <RatingButton key={index} className="text-yellow-500" />
                  ))}
                </Rating>
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
            name={name}
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <InputGroup>
                  <InputGroupTextarea
                    {...field}
                    placeholder={placeholder}
                    id={name}
                    rows={6}
                    className="min-h-24 resize-none"
                    aria-invalid={fieldState.invalid}
                  />
                  {maxChars && (
                    <InputGroupAddon align="block-end">
                      <InputGroupText className="tabular-nums">
                        {field.value.length}/{maxChars} characters
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

      case "textInput":
        return (
          <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <div className="flex items-center gap-3">
                  <FieldLabel htmlFor={name}>
                    {label} {required && "*"}
                  </FieldLabel>
                  {tooltip && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="cursor-pointer" size={15} />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{tooltip}</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
                <Input {...field} id={name} aria-invalid={fieldState.invalid} />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        );

      case "photoUpload":
        return (
          <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={name}>
                  {label} {required && "*"}
                </FieldLabel>
                <div className="flex items-center gap-5">
                  <div className="relative size-17 rounded-full bg-muted">
                    {previewPhoto && (
                      <Image
                        src={previewPhoto}
                        fill
                        alt="avatar"
                        className="rounded-full object-cover"
                        sizes="68px"
                      />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      id={name}
                      ref={fileInputRef}
                      type="file"
                      className="sr-only"
                      accept=".jpg, .jpeg, .png"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        field.onChange(file);
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Choose file
                    </Button>
                    {previewPhoto && (
                      <Button
                        size="icon-sm"
                        variant="outline"
                        type="button"
                        onClick={() => form.resetField("photo")}
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
        );

      case "checkbox":
        return (
          <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <div className="flex items-center gap-3">
                  <Checkbox
                    id={name}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <FieldLabel htmlFor={name}>
                    {label} {required && "*"}
                  </FieldLabel>
                </div>
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
        className="max-h-screen overflow-y-scroll"
        onOpenAutoFocus={(e) => e.preventDefault()} // prevent focus trap
        onInteractOutside={(e) => isSubmitting && e.preventDefault()} // prevent closing when submitting
      >
        <DialogHeader>
          <DialogTitle>Send Testimonial</DialogTitle>
          <DialogDescription className="sr-only">
            Fill out the form to send your testimonial.
          </DialogDescription>
        </DialogHeader>

        <form className="mt-2 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          {fields.map((field, index) => (
            <Fragment key={`${field.name}-${index}`}>
              {renderField(field)}
            </Fragment>
          ))}
          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              type="submit"
              className="bg-theme-primary hover:bg-theme-primary/90"
              disabled={isSubmitting}
            >
              Send
              {isSubmitting && <Spinner />}
            </Button>
          </DialogFooter>
        </form>

        <OverlayBlocker isVisible={isSubmitting} />
      </DialogContent>
    </Dialog>
  );
}
