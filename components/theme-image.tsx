import { cn } from "@/lib/utils";
import Image, { ImageProps } from "next/image";

interface ThemeImageProps extends Omit<ImageProps, "src"> {
  darkSrc: string;
  lightSrc: string;
}

export default function ThemeImage({
  darkSrc,
  lightSrc,
  className,
  alt,
  ...rest
}: ThemeImageProps) {
  return (
    <>
      <Image
        src={darkSrc}
        className={cn("hidden dark:block", className)}
        alt={alt}
        {...rest}
      />
      <Image
        src={lightSrc}
        className={cn("block dark:hidden", className)}
        alt={alt}
        {...rest}
      />
    </>
  );
}
