import AppearanceContent from "../_components/appearance-content";
import TestimonialsContent from "../_components/testimonials-content";

export const tabs = [
  {
    value: "testimonials",
    label: "Testimonials",
    content: TestimonialsContent,
  },
  {
    value: "appearance",
    label: "Appearance",
    content: AppearanceContent,
  },
];

export const defaultValue = "testimonials";

export const themeColors = {
  dark: {
    page_bg_color: "#0a0a0a",
    card_bg_color: "#171717",
    text_primary_color: "#fafafa",
    text_secondary_color: "#a1a1a1",
    border_color: "#ffffff1a",
  },
  light: {
    page_bg_color: "#ffffff",
    card_bg_color: "#ffffff",
    text_primary_color: "#0a0a0a",
    text_secondary_color: "#737373",
    border_color: "#e5e5e5",
  },
};
