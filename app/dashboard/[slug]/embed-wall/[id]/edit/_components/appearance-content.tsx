"use client";

import { Field, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useColor } from "react-color-palette";
import "react-color-palette/css";
import ColorPicker from "./color-picker";

export default function AppearanceContent() {
  const [color, setColor] = useColor("#561ecb");

  return (
    <div className="mx-auto my-2 w-100 space-y-6">
      <div className="bg-card relative rounded-lg border p-5">
        <h4 className="bg-background absolute -top-3.5 left-3 rounded px-1.5">
          Components Visibility
        </h4>
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <Label className="min-w-18" htmlFor="airplane-mode">
              Date
            </Label>
            <Switch
              className="data-[state=checked]:bg-theme-primary!"
              id="airplane-mode"
            />
          </div>
          <div className="flex items-center gap-4">
            <Label className="min-w-18" htmlFor="airplane-mode">
              Title
            </Label>
            <Switch
              className="data-[state=checked]:bg-theme-primary!"
              id="airplane-mode"
            />
          </div>
          <div className="flex items-center gap-4">
            <Label className="min-w-18" htmlFor="airplane-mode">
              Company
            </Label>
            <Switch
              className="data-[state=checked]:bg-theme-primary!"
              id="airplane-mode"
            />
          </div>
          <div className="flex items-center gap-4">
            <Label className="min-w-18" htmlFor="airplane-mode">
              Star rating
            </Label>
            <Switch
              className="data-[state=checked]:bg-theme-primary!"
              id="airplane-mode"
            />
          </div>
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
              <label
                htmlFor="dark"
                className="has-checked:border-theme-primary has-checked:bg-theme-primary/8 flex size-15 cursor-pointer items-center justify-center rounded border transition-colors"
              >
                <input
                  className="sr-only"
                  type="radio"
                  name="theme"
                  value="dark"
                  id="dark"
                />
                <span className="text-muted-foreground text-xs">Dark</span>
              </label>
              <label
                htmlFor="light"
                className="has-checked:border-theme-primary has-checked:bg-theme-primary/8 flex size-15 cursor-pointer items-center justify-center rounded border transition-colors"
              >
                <input
                  className="sr-only"
                  type="radio"
                  name="theme"
                  value="light"
                  id="light"
                />
                <span className="text-muted-foreground text-xs">Light</span>
              </label>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="w-38">Page background</span>
            <ColorPicker color={color} onChange={setColor} />
          </div>
          <div className="flex items-center gap-4">
            <span className="w-38">Card background</span>
            <ColorPicker color={color} onChange={setColor} />
          </div>
          <div className="flex items-center gap-4">
            <span className="w-38">Text primary</span>
            <ColorPicker color={color} onChange={setColor} />
          </div>
          <div className="flex items-center gap-4">
            <span className="w-38">Text secondary</span>
            <ColorPicker color={color} onChange={setColor} />
          </div>
          <div className="flex items-center gap-4">
            <span className="w-38">Border</span>
            <ColorPicker color={color} onChange={setColor} />
          </div>
        </div>
      </div>
      <div className="bg-card relative rounded-lg border p-5">
        <h4 className="bg-background absolute -top-3.5 left-3 rounded px-1.5">
          Layout & Borders
        </h4>
        <div className="space-y-3 text-sm">
          <Field>
            <FieldLabel htmlFor="card_gap">Card gap</FieldLabel>
            <InputGroup>
              <InputGroupInput />
              <InputGroupAddon align="inline-end">px</InputGroupAddon>
            </InputGroup>
          </Field>
          <Field>
            <FieldLabel htmlFor="card_gap">Border thickness</FieldLabel>
            <InputGroup>
              <InputGroupInput />
              <InputGroupAddon align="inline-end">px</InputGroupAddon>
            </InputGroup>
          </Field>
          <Field>
            <FieldLabel htmlFor="card_gap">Border radius</FieldLabel>
            <InputGroup>
              <InputGroupInput />
              <InputGroupAddon align="inline-end">px</InputGroupAddon>
            </InputGroup>
          </Field>
        </div>
      </div>
    </div>
  );
}
