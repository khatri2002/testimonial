"use client";

import { isSlugAvailable } from "@/actions/testimonial";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CreateSpaceSchema } from "@/lib/schema.types";
import {
  ChevronDown,
  CircleCheckBig,
  CircleX,
  MessageCircleWarning,
  Trash,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import {
  Controller,
  useFieldArray,
  useFormContext,
  useWatch,
} from "react-hook-form";
import { useDebounce } from "use-debounce";
import { generateSlug } from "../_lib/utils";

export default function BasicsTabContent() {
  const {
    control,
    setValue,
    trigger,
    formState: { errors },
    resetField,
  } = useFormContext<CreateSpaceSchema>();

  const name = useWatch({ control, name: "basics.name" });
  const slug = useWatch({ control, name: "basics.slug" });
  const [debouncedSlug] = useDebounce(slug, 700);

  useEffect(() => {
    if (!name) return;

    const generatedSlug = generateSlug(name);
    setValue("basics.slug", generatedSlug, { shouldValidate: true });
  }, [name, setValue]);

  const [isPending, startTransition] = useTransition();
  const [slugAvailableRes, setSlugAvailableRes] = useState<{
    success: boolean;
    available?: boolean;
  } | null>(null);

  const slugAvailability = debouncedSlug && !errors.basics?.slug; // only check availability if slug is valid

  useEffect(() => {
    if (slugAvailability)
      startTransition(() => {
        isSlugAvailable(debouncedSlug).then((res) => setSlugAvailableRes(res));
      });
  }, [debouncedSlug, slugAvailability]);

  const renderSlugAddOn = () => {
    if (isPending) return <Spinner />;
    if (!slugAvailability || !slugAvailableRes) return;
    if (!slugAvailableRes.success)
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <InputGroupButton variant="ghost" aria-label="error" size="icon-xs">
              <MessageCircleWarning className="text-red-500" />
            </InputGroupButton>
          </TooltipTrigger>
          <TooltipContent>
            <p>Unable to verify slug availability. Please try again later.</p>
          </TooltipContent>
        </Tooltip>
      );
    if (slugAvailableRes.available)
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <InputGroupButton
              variant="ghost"
              aria-label="available"
              size="icon-xs"
            >
              <CircleCheckBig className="text-green-500" />
            </InputGroupButton>
          </TooltipTrigger>
          <TooltipContent>
            <p>Great! This URL is available for use.</p>
          </TooltipContent>
        </Tooltip>
      );
    if (!slugAvailableRes.available)
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <InputGroupButton
              variant="ghost"
              aria-label="available"
              size="icon-xs"
            >
              <CircleX className="text-red-500" />
            </InputGroupButton>
          </TooltipTrigger>
          <TooltipContent>
            <p>This URL is already taken. Please choose a different one.</p>
          </TooltipContent>
        </Tooltip>
      );
  };

  const { fields } = useFieldArray({
    control,
    name: "basics.extra_information",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const image = useWatch({ control, name: "basics.image" });
  const previewImage = useMemo(
    () => image && URL.createObjectURL(image),
    [image],
  );

  return (
    <div className="mt-1">
      <h2 className="mb-5 text-center text-lg">Basic Details</h2>
      <FieldGroup className="mt-2">
        <Controller
          name="basics.name"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="basics.name">
                Space name <span>*</span>
              </FieldLabel>
              <Input
                {...field}
                id="basics.name"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="basics.slug"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="basics.slug">
                Public URL <span>*</span>
              </FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="basics.slug"
                  {...field}
                  placeholder="my-space"
                  className="pl-1!"
                  aria-invalid={fieldState.invalid}
                  onChange={(e) => {
                    field.onChange(e);
                    trigger("basics.slug"); // validate on change to give immediate feedback
                  }}
                />
                <InputGroupAddon>
                  <InputGroupText>http://localhost:3000/</InputGroupText>
                </InputGroupAddon>
                <InputGroupAddon align="inline-end">
                  {renderSlugAddOn()}
                </InputGroupAddon>
              </InputGroup>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="basics.header_title"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="basics.header_title">
                Header title <span>*</span>
              </FieldLabel>
              <Input
                {...field}
                id="basics.header_title"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="basics.image"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="basics.image">
                Image <span>*</span>
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
                  id="basics.image"
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
                      resetField("basics.image");
                      trigger("basics.image");
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
          name="basics.message"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="basics.message">
                Your custom message <span>*</span>
              </FieldLabel>
              <Textarea
                {...field}
                id="basics.message"
                aria-invalid={fieldState.invalid}
                className="min-h-24"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="basics.collect_star_rating"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="basics.collect_star_rating">
                Collect star rating
              </FieldLabel>
              <Switch
                id="basics.collect_star_rating"
                className="data-[state=checked]:bg-theme-primary w-8!"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Field>
          <FieldLabel>Collect extra information</FieldLabel>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="data-[state=open]:ring-ring data-[state=open]:border-ring! w-fit! ring-[0.5px] ring-transparent"
              >
                Name, email, company etc.
                <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-76 p-0">
              <ul>
                {fields.map(({ id, label, disabled }, index) => (
                  <li
                    key={id}
                    className="flex items-center justify-between border-b p-3.5"
                  >
                    <div className="flex items-center gap-2">
                      <Controller
                        control={control}
                        name={`basics.extra_information.${index}.active`}
                        render={({ field }) => (
                          <Switch
                            id={`basics.extra_information.${index}.active`}
                            className="data-[state=checked]:bg-theme-primary"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={disabled}
                          />
                        )}
                      />
                      <Label
                        htmlFor={`basics.extra_information.${index}.active`}
                      >
                        {label}
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Controller
                        control={control}
                        name={`basics.extra_information.${index}.validations.required`}
                        render={({ field }) => (
                          <Checkbox
                            id={`basics.extra_information.${index}.validations.required`}
                            className="data-[state=checked]:bg-theme-primary!"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={disabled}
                          />
                        )}
                      />
                      <Label
                        htmlFor={`basics.extra_information.${index}.validations.required`}
                        aria-disabled
                      >
                        Required?
                      </Label>
                    </div>
                  </li>
                ))}
              </ul>
            </DropdownMenuContent>
          </DropdownMenu>
        </Field>
        <Controller
          name="basics.dark_mode"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="basics.dark_mode">Dark mode</FieldLabel>
              <Switch
                id="basics.dark_mode"
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
