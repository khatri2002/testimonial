export type TransformedResponse = {
  id: string;
  answers: Record<
    string,
    {
      label: string;
      type: "textbox" | "textarea" | "checkbox" | "rating";
      position: number;
      value: string | number | boolean;
    }
  >;
  submitted_at: Date;
  spaceId: string;
};
