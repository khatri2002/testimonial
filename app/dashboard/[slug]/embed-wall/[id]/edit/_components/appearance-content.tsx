"use client";

import { Field, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
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
import { EmbedWallSchema } from "@/lib/schema.types";
import "react-color-palette/css";
import { Controller, useFormContext } from "react-hook-form";

import { themeColors } from "../_lib/config";

import { updateEmbedWall } from "@/actions/embed-wall";
import { borderRadiusOptions, themeOptions } from "@/lib/config";
import { toast } from "sonner";
import { useEmbedWallStore } from "../_lib/useEmbedWallStore";
import ColorPicker from "./color-picker";

export default function AppearanceContent() {
  const id = useEmbedWallStore((state) => state.id);
  const { register, control, setValue, getValues } =
    useFormContext<EmbedWallSchema>();

  const handleThemeChange = (theme: (typeof themeOptions)[number]["value"]) => {
    const colors = themeColors[theme];

    setValue("themes_colors.page_bg_color", colors.page_bg_color);
    setValue("themes_colors.card_bg_color", colors.card_bg_color);
    setValue("themes_colors.text_primary_color", colors.text_primary_color);
    setValue("themes_colors.text_secondary_color", colors.text_secondary_color);
    setValue("themes_colors.border_color", colors.border_color);
  };

  const handleUpdateEmbedWall = async () => {
    if (!id) return;

    const embedWallData = getValues();
    const { success } = await updateEmbedWall(id, embedWallData);
    if (!success) toast.error("Couldn't save");
  };

  return (
    <div className="mx-auto my-2 max-w-100 space-y-6">
      <div className="bg-card relative rounded-lg border p-5">
        <h4 className="bg-background absolute -top-3.5 left-3 rounded px-1.5">
          Components Visibility
        </h4>
        <div className="space-y-3">
          <Controller
            name="components_visibility.show_date"
            control={control}
            render={({ field }) => (
              <div className="flex items-center gap-4">
                <Label
                  className="min-w-18"
                  htmlFor="components_visibility.show_date"
                >
                  Date
                </Label>
                <Switch
                  className="data-[state=checked]:bg-theme-primary!"
                  id="components_visibility.show_date"
                  checked={field.value}
                  onCheckedChange={(checked) => {
                    field.onChange(checked);
                    handleUpdateEmbedWall();
                  }}
                />
              </div>
            )}
          />
          <Controller
            name="components_visibility.show_title"
            control={control}
            render={({ field }) => (
              <div className="flex items-center gap-4">
                <Label
                  className="min-w-18"
                  htmlFor="components_visibility.show_title"
                >
                  Title
                </Label>
                <Switch
                  className="data-[state=checked]:bg-theme-primary!"
                  id="components_visibility.show_title"
                  checked={field.value}
                  onCheckedChange={(checked) => {
                    field.onChange(checked);
                    handleUpdateEmbedWall();
                  }}
                />
              </div>
            )}
          />
          <Controller
            name="components_visibility.show_company"
            control={control}
            render={({ field }) => (
              <div className="flex items-center gap-4">
                <Label
                  className="min-w-18"
                  htmlFor="components_visibility.show_company"
                >
                  Company
                </Label>
                <Switch
                  className="data-[state=checked]:bg-theme-primary!"
                  id="components_visibility.show_company"
                  checked={field.value}
                  onCheckedChange={(checked) => {
                    field.onChange(checked);
                    handleUpdateEmbedWall();
                  }}
                />
              </div>
            )}
          />
          <Controller
            name="components_visibility.show_star_rating"
            control={control}
            render={({ field }) => (
              <div className="flex items-center gap-4">
                <Label
                  className="min-w-18"
                  htmlFor="components_visibility.show_star_rating"
                >
                  Star rating
                </Label>
                <Switch
                  className="data-[state=checked]:bg-theme-primary!"
                  id="components_visibility.show_star_rating"
                  checked={field.value}
                  onCheckedChange={(checked) => {
                    field.onChange(checked);
                    handleUpdateEmbedWall();
                  }}
                />
              </div>
            )}
          />
        </div>
      </div>
      <div className="bg-card relative rounded-lg border p-5">
        <h4 className="bg-background absolute -top-3.5 left-3 rounded px-1.5">
          Theme & Colors
        </h4>
        <div className="space-y-3 text-sm">
          <div>
            <span className="block">Theme</span>
            <div className="mt-1 flex gap-2">
              {themeOptions.map((option) => (
                <label
                  key={option.value}
                  htmlFor={option.value}
                  className="has-checked:border-theme-primary has-checked:bg-theme-primary/8 flex size-15 cursor-pointer items-center justify-center rounded border transition-colors"
                >
                  <input
                    {...register("themes_colors.theme")}
                    className="sr-only"
                    type="radio"
                    name="theme"
                    value={option.value}
                    id={option.value}
                    onChange={() => {
                      handleThemeChange(option.value);
                      handleUpdateEmbedWall();
                    }}
                  />
                  <span className="text-muted-foreground text-xs">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
          <Controller
            name="themes_colors.page_bg_color"
            control={control}
            render={({ field }) => (
              <div className="flex items-center gap-4">
                <span className="w-38">Page background</span>
                <ColorPicker
                  color={field.value}
                  onChange={(color) => field.onChange(color)}
                  onClose={() => handleUpdateEmbedWall()}
                />
              </div>
            )}
          />
          <Controller
            name="themes_colors.card_bg_color"
            control={control}
            render={({ field }) => (
              <div className="flex items-center gap-4">
                <span className="w-38">Card background</span>
                <ColorPicker
                  color={field.value}
                  onChange={(color) => field.onChange(color)}
                  onClose={() => handleUpdateEmbedWall()}
                />
              </div>
            )}
          />
          <Controller
            name="themes_colors.text_primary_color"
            control={control}
            render={({ field }) => (
              <div className="flex items-center gap-4">
                <span className="w-38">Text primary</span>
                <ColorPicker
                  color={field.value}
                  onChange={(color) => field.onChange(color)}
                  onClose={() => handleUpdateEmbedWall()}
                />
              </div>
            )}
          />
          <Controller
            name="themes_colors.text_secondary_color"
            control={control}
            render={({ field }) => (
              <div className="flex items-center gap-4">
                <span className="w-38">Text secondary</span>
                <ColorPicker
                  color={field.value}
                  onChange={(color) => field.onChange(color)}
                  onClose={() => handleUpdateEmbedWall()}
                />
              </div>
            )}
          />
          <Controller
            name="themes_colors.border_color"
            control={control}
            render={({ field }) => (
              <div className="flex items-center gap-4">
                <span className="w-38">Border</span>
                <ColorPicker
                  color={field.value}
                  onChange={(color) => field.onChange(color)}
                  onClose={() => handleUpdateEmbedWall()}
                />
              </div>
            )}
          />
        </div>
      </div>
      <div className="bg-card relative rounded-lg border p-5">
        <h4 className="bg-background absolute -top-3.5 left-3 rounded px-1.5">
          Layout & Borders
        </h4>
        <div className="space-y-3 text-sm">
          <Controller
            name="layout_borders.card_gap"
            control={control}
            render={({ field }) => (
              <Field>
                <FieldLabel htmlFor="layout_borders.card_gap">
                  Card gap
                </FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id="layout_borders.card_gap"
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (!/^\d{0,2}$/.test(value)) return;

                      if (value === "") {
                        field.onChange(0);
                        return;
                      }

                      field.onChange(Number(value));
                    }}
                    onBlur={() => handleUpdateEmbedWall()}
                  />
                  <InputGroupAddon align="inline-end">px</InputGroupAddon>
                </InputGroup>
              </Field>
            )}
          />
          <Controller
            name="layout_borders.border_thickness"
            control={control}
            render={({ field }) => (
              <Field>
                <FieldLabel htmlFor="layout_borders.border_thickness">
                  Border thickness
                </FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id="layout_borders.border_thickness"
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (!/^\d{0,2}$/.test(value)) return;

                      if (value === "") {
                        field.onChange(0);
                        return;
                      }

                      field.onChange(Number(value));
                    }}
                    onBlur={() => handleUpdateEmbedWall()}
                  />
                  <InputGroupAddon align="inline-end">px</InputGroupAddon>
                </InputGroup>
              </Field>
            )}
          />
          <Controller
            name="layout_borders.border_radius"
            control={control}
            render={({ field }) => (
              <Field>
                <FieldLabel htmlFor="card_gap">Border radius</FieldLabel>
                <Select
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                    handleUpdateEmbedWall();
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a fruit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {borderRadiusOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            )}
          />
        </div>
      </div>
    </div>
  );
}
