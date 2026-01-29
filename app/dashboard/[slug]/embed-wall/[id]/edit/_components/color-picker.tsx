import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import {
  ColorPicker as ColorPickerComponent,
  useColor,
} from "react-color-palette";

interface ColorPickerProps {
  color: string | undefined;
  onChange: (color: string) => void;
  onClose?: () => void;
}

export default function ColorPicker({
  color,
  onChange,
  onClose,
}: ColorPickerProps) {
  const [internalColor, setInternalColor] = useColor(color || "#fff");
  const [openMenu, setOpenMenu] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setOpenMenu(open);

    if (!open) onClose?.();
  };

  return (
    <DropdownMenu open={openMenu} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <button className="cursor-pointer">
          <span
            className="block size-5 rounded border"
            style={{ backgroundColor: internalColor.hex }}
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="start">
        <ColorPickerComponent
          color={internalColor}
          onChange={(color) => {
            setInternalColor(color);
            onChange(color.hex);
          }}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
