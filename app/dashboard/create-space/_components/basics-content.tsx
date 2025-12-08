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
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { CreateSpaceSchema } from "@/lib/schema/schema.types";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  CircleAlert,
  CircleCheck,
  CirclePlus,
  Trash,
} from "lucide-react";
import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import {
  Controller,
  useFieldArray,
  useFormContext,
  useWatch,
} from "react-hook-form";
import { SlugAlert } from "../_lib/types";
import { slugify } from "../_lib/utils";

interface BasicContentProps {
  slugAlert: SlugAlert;
}

export default function BasicContent({ slugAlert }: BasicContentProps) {
  const { control, resetField, setValue, getValues } =
    useFormContext<CreateSpaceSchema>();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const photo = useWatch({ control, name: "basics.image" });
  const previewPhoto = useMemo(
    () => photo && URL.createObjectURL(photo),
    [photo],
  );

  const { fields: systemFields } = useFieldArray({
    control,
    name: "basics.extra_fields_system",
  });
  const {
    fields: userFields,
    append: userFieldsAppend,
    remove: userFieldsRemove,
  } = useFieldArray({
    control,
    name: "basics.extra_fields_user",
  });

  const [openExtraFieldsDropdown, setOpenExtraFieldsDropdown] = useState(false);
  const handleOnOpenExtraFieldsDropdown = (open: boolean) => {
    setOpenExtraFieldsDropdown(open);
    if (!open) {
      // when closing the dropdown, remove any user fields with empty labels
      const extraFieldsUser = getValues("basics.extra_fields_user");
      const filteredExtraFields = extraFieldsUser.filter(({ label }) =>
        label.trim(),
      );
      setValue("basics.extra_fields_user", filteredExtraFields);
    }
  };

  return (
    <>
      <h2 className="my-3 text-center text-3xl font-medium">Basic Details</h2>
      <FieldSet>
        <FieldGroup>
          <Controller
            control={control}
            name="basics.name"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="basics.name">Space Name</FieldLabel>
                <Input
                  {...field}
                  id="basics.name"
                  aria-invalid={fieldState.invalid}
                  onChange={(e) => {
                    // auto-generate slug on name change
                    const name = e.target.value;
                    const slug = slugify(name);
                    setValue("basics.slug", slug, { shouldValidate: true });

                    field.onChange(e);
                  }}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            control={control}
            name="basics.slug"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="basics.slug">Public URL</FieldLabel>
                <div className="flex">
                  <div className="border-input flex items-center justify-center rounded-l-md border px-3">
                    <span className="text-muted-foreground text-sm">
                      https://testimonial.to/
                    </span>
                  </div>
                  <Input
                    {...field}
                    id="basics.slug"
                    className="rounded-l-none border-l-0"
                    onChange={(e) => {
                      // validate on change
                      setValue("basics.slug", e.target.value, {
                        shouldValidate: true,
                      });
                    }}
                  />
                </div>
                {fieldState.invalid ? (
                  <FieldError errors={[fieldState.error]} />
                ) : (
                  slugAlert.show && (
                    <div
                      className={cn("flex items-center gap-2", {
                        "text-chart-2": slugAlert.variant === "success",
                        "text-destructive": slugAlert.variant === "error",
                      })}
                    >
                      {slugAlert.variant == "success" ? (
                        <CircleCheck size={17} />
                      ) : (
                        <CircleAlert size={17} />
                      )}

                      <span className="text-sm">{slugAlert.message}</span>
                    </div>
                  )
                )}
              </Field>
            )}
          />
          <Controller
            control={control}
            name="basics.header"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="basics.header">Header</FieldLabel>
                <Input
                  {...field}
                  id="basics.header"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            control={control}
            name="basics.message"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="basics.message">Message</FieldLabel>
                <Textarea
                  {...field}
                  id="basics.message"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            control={control}
            name="basics.image"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="basics.image">Image</FieldLabel>
                <div className="flex items-center gap-5">
                  <div className="bg-muted relative size-14 rounded">
                    {previewPhoto && (
                      <Image
                        src={previewPhoto}
                        fill
                        alt="space-image"
                        className="rounded object-cover"
                        sizes="56px"
                      />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      id="basics.image"
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
                      Choose file
                    </Button>
                    {previewPhoto && (
                      <Button
                        size="icon-sm"
                        variant="outline"
                        type="button"
                        onClick={() => resetField("basics.image")}
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
          <Field>
            <FieldLabel>Collect extra information</FieldLabel>
            <div>
              <DropdownMenu
                open={openExtraFieldsDropdown}
                onOpenChange={handleOnOpenExtraFieldsDropdown}
              >
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    Name, email, title, etc.
                    <ChevronDown />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-85 p-0" align="start">
                  <ul>
                    {systemFields.map(({ id, label, disabled }, index) => (
                      <li
                        key={id}
                        className="flex items-center justify-between border-b p-3 last:border-b-0"
                      >
                        <Controller
                          control={control}
                          name={`basics.extra_fields_system.${index}.include`}
                          render={({ field }) => (
                            <div className="flex items-center gap-2">
                              <Switch
                                id={`basics.extra_fields_system.${index}.include`}
                                checked={field.value}
                                onCheckedChange={(checked) => {
                                  field.onChange(checked);

                                  // if disabling the field, also set required to false
                                  if (!checked)
                                    setValue(
                                      `basics.extra_fields_system.${index}.required`,
                                      false,
                                    );
                                }}
                                disabled={disabled}
                              />
                              <Label
                                htmlFor={`basics.extra_fields_system.${index}.include`}
                              >
                                {label}
                              </Label>
                            </div>
                          )}
                        />
                        <Controller
                          control={control}
                          name={`basics.extra_fields_system.${index}.required`}
                          render={({ field }) => (
                            <div className="flex items-center gap-2">
                              <Checkbox
                                id={`basics.extra_fields_system.${index}.required`}
                                checked={field.value}
                                onCheckedChange={(checked) => {
                                  field.onChange(checked);

                                  // if setting to required, also ensure the field is included
                                  if (checked)
                                    setValue(
                                      `basics.extra_fields_system.${index}.include`,
                                      true,
                                    );
                                }}
                                disabled={disabled}
                              />
                              <Label
                                htmlFor={`basics.extra_fields_system.${index}.required`}
                              >
                                Required
                              </Label>
                            </div>
                          )}
                        />
                      </li>
                    ))}
                  </ul>
                  <div className="p-3">
                    <span className="text-sm">Create your own fields</span>
                    <ul className="my-3 space-y-2">
                      {userFields.map(({ id }, index) => (
                        <li key={id} className="flex items-center gap-2">
                          <div className="flex">
                            <Controller
                              control={control}
                              name={`basics.extra_fields_user.${index}.label`}
                              render={({ field }) => (
                                <Input
                                  id={`basics.extra_fields_user.${index}.label`}
                                  placeholder="Enter label"
                                  className="rounded-r-none"
                                  {...field}
                                />
                              )}
                            />
                            <Controller
                              control={control}
                              name={`basics.extra_fields_user.${index}.required`}
                              render={({ field }) => (
                                <div className="bg-background border-input flex items-center gap-2 rounded-r-md border border-l-0 px-2">
                                  <Checkbox
                                    id={`basics.extra_fields_user.${index}.required`}
                                    checked={field.value}
                                    onCheckedChange={(checked) =>
                                      field.onChange(checked)
                                    }
                                  />
                                  <Label
                                    htmlFor={`basics.extra_fields_user.${index}.required`}
                                  >
                                    Required
                                  </Label>
                                </div>
                              )}
                            />
                          </div>
                          <button
                            className="hover:text-destructive cursor-pointer transition-colors"
                            onClick={() => userFieldsRemove(index)}
                          >
                            <Trash size={16} />
                          </button>
                        </li>
                      ))}
                    </ul>
                    <Button
                      variant="secondary"
                      onClick={() =>
                        userFieldsAppend({
                          label: "",
                          name: "",
                          required: false,
                          type: "text",
                        })
                      }
                    >
                      <CirclePlus />
                      Add a new field
                    </Button>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </Field>
          <Controller
            control={control}
            name="basics.collect_star_ratings"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="basics.collect_star_ratings">
                  Collect Star Ratings
                </FieldLabel>
                <div>
                  <Switch
                    id="basics.collect_star_ratings"
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
            name="basics.photo_field_mode"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="basics.message">
                  Photo Collection
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
        </FieldGroup>
      </FieldSet>
    </>
  );
}
