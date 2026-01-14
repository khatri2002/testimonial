import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { SpaceSchema } from "@/lib/schema.types";
import { CirclePlus, EllipsisVertical, Trash } from "lucide-react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";

export default function PromptsTabContent() {
  const { control, trigger } = useFormContext<SpaceSchema>();

  const { fields, remove, append } = useFieldArray({
    control,
    name: "prompts.questions",
  });

  return (
    <div className="mt-1">
      <h2 className="mb-5 text-center text-lg">Prompts & Questions</h2>
      <FieldGroup className="mt-2">
        <Controller
          name="prompts.question_label"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="prompts.question_label">
                Question label
              </FieldLabel>
              <Input
                {...field}
                id="prompts.question_label"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Field>
          <FieldLabel htmlFor="basics.name">Questions</FieldLabel>
          <ul className="space-y-3">
            {fields.map(({ id }, index) => (
              <li key={id} className="flex items-center">
                <EllipsisVertical className="text-muted-foreground" />
                <Controller
                  control={control}
                  name={`prompts.questions.${index}.question`}
                  render={({ field, fieldState }) => (
                    <Input
                      {...field}
                      id={`prompts.questions.${index}.question`}
                      className="ml-1"
                      aria-invalid={fieldState.invalid}
                    />
                  )}
                />
                <Button
                  size="icon-sm"
                  variant="ghost"
                  className="ml-2"
                  onClick={() => {
                    remove(index);
                    trigger("prompts.question_label"); // trigger validation for question_label
                  }}
                >
                  <Trash />
                </Button>
              </li>
            ))}
          </ul>
          {fields.length < 5 && (
            <Button variant="ghost" onClick={() => append({ question: "" })}>
              <CirclePlus />
              Add one (Up to 5)
            </Button>
          )}
        </Field>
      </FieldGroup>
    </div>
  );
}
