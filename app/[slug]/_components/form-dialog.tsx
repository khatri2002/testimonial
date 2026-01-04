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
import { zodResolver } from "@hookform/resolvers/zod";
import { Info } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { testimonialFormSchema } from "../_lib/schema";
import { TestimonialFormSchema } from "../_lib/schema.types";
import DialogLoadingOverlay from "./dialog-loading-overlay";

interface FormDialogProps {
  open: boolean;
  handleOpenChange: (open: boolean) => void;
  onSubmit: (data: TestimonialFormSchema) => void;
}

export default function FormDialog({
  open,
  handleOpenChange,
  onSubmit,
}: FormDialogProps) {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<TestimonialFormSchema>({
    resolver: zodResolver(testimonialFormSchema),
    defaultValues: {
      rating: 0,
      testimonial: "",
      name: "",
      email: "",
      consent: false,
    },
    shouldFocusError: false,
  });

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogLoadingOverlay isLoading={isSubmitting} />

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Write testimonial to Indigo</DialogTitle>
            <DialogDescription className="sr-only">
              Write testimonial to Indigo
            </DialogDescription>
          </DialogHeader>
          <FieldGroup className="gap-4">
            <Controller
              name="rating"
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
            <Controller
              name="testimonial"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <InputGroup>
                    <InputGroupTextarea
                      {...field}
                      id="testimonial"
                      aria-invalid={fieldState.invalid}
                      placeholder="Write your testimonial here..."
                      maxLength={100}
                      className="min-h-30!"
                    />
                    <InputGroupAddon align="block-end">
                      <InputGroupText className="text-muted-foreground text-xs">
                        {field.value.length}/100 characters
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="name"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="name" className="w-fit!">
                    Name <span>*</span>
                  </FieldLabel>
                  <Input
                    {...field}
                    id="name"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="email"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="email" className="w-fit!">
                    Email
                    <span>*</span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info
                          size={15}
                          className="text-foreground cursor-pointer"
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Your email will not be shared.</p>
                      </TooltipContent>
                    </Tooltip>
                  </FieldLabel>

                  <Input
                    {...field}
                    id="email"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="consent"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <div className="flex gap-3">
                    <Checkbox
                      id="consent"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <FieldLabel htmlFor="consent">
                      I give permission to use this testimonial across social
                      channels and other marketing efforts. *
                    </FieldLabel>
                  </div>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
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
