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
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Info, Trash } from "lucide-react";
import Image from "next/image";
import { useMemo, useRef } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { testimonialForm } from "../_lib/schema";
import { TestimonialForm } from "../_lib/types.schema";

interface TestimonialDialogProps {
  open: boolean;
  handleOpenChange: (open: boolean) => void;
  onSubmit: (data: TestimonialForm) => void;
}

export default function TestimonialDialog({
  open,
  handleOpenChange,
  onSubmit,
}: TestimonialDialogProps) {
  const form = useForm<TestimonialForm>({
    resolver: zodResolver(testimonialForm),
    defaultValues: {
      rating: 0,
      testimonial: "",
      name: "",
      organization: "",
      email: "",
      photo: undefined,
      consent: false,
    },
  });
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const photo = useWatch({ control, name: "photo" });
  const previewPhoto = useMemo(
    () => photo && URL.createObjectURL(photo),
    [photo],
  );

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
          <Controller
            name="rating"
            control={control}
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
          <Controller
            name="testimonial"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <InputGroup>
                  <InputGroupTextarea
                    {...field}
                    placeholder="Write your testimonial here..."
                    id="testimonial"
                    rows={6}
                    className="min-h-24 resize-none"
                    aria-invalid={fieldState.invalid}
                  />
                  <InputGroupAddon align="block-end">
                    <InputGroupText className="tabular-nums">
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
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <Input {...field} id="name" aria-invalid={fieldState.invalid} />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="organization"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="organization">Organization</FieldLabel>
                <Input
                  {...field}
                  id="organization"
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
                <div className="flex items-center gap-3">
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="cursor-pointer" size={15} />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Your email address will not be shared publicly.</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
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
            name="photo"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="photo">Photo</FieldLabel>
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
                      id="photo"
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
          <Controller
            name="consent"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="consent"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <FieldLabel htmlFor="consent">
                    I give permission to use this testimonial across social
                    channels and other marketing efforts
                  </FieldLabel>
                </div>
              </Field>
            )}
          />
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
