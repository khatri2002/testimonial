import AppearanceContent from "../_components/appearance-content";
import TestimonialsContent from "../_components/testimonials-content";

export const tabs = [
  {
    value: "testimonials",
    label: "Testimonials",
    content: <TestimonialsContent />,
  },
  {
    value: "appearance",
    label: "Appearance",
    content: <AppearanceContent />,
  },
];

export const defaultValue = "testimonials";
