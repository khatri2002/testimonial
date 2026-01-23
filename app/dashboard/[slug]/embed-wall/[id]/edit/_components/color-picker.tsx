import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ColorPicker as ColorPickerComponent,
  IColor,
} from "react-color-palette";

interface ColorPickerProps {
  color: IColor;
  onChange: (color: IColor) => void;
}

export default function ColorPicker({ color, onChange }: ColorPickerProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="cursor-pointer">
          <span
            className="block size-5 rounded border"
            style={{ backgroundColor: color.hex }}
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="start">
        <ColorPickerComponent color={color} onChange={onChange} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
