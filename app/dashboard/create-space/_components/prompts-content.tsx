import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { CirclePlus, EllipsisVertical, Trash } from "lucide-react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { CreateSpaceSchema } from "../_lib/schema.types";

export default function PromptsContent() {
  const { control } = useFormContext<CreateSpaceSchema>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "prompts.questions",
  });

  return (
    <>
      <h2 className="my-3 text-center text-3xl font-medium">
        Prompts & Questions
      </h2>
      <FieldSet>
        <FieldGroup>
          <Controller
            control={control}
            name="prompts.questions_label"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="prompts.questions_label">
                  Question label
                </FieldLabel>
                <Input
                  {...field}
                  id="prompts.questions_label"
                  aria-invalid={fieldState.invalid}
                  placeholder="QUESTIONS"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Field>
            <FieldLabel>Questions</FieldLabel>
            <ul className="space-y-3">
              {fields.map(({ id }, index) => (
                <li key={id} className="flex items-center gap-2">
                  <EllipsisVertical />
                  <Controller
                    control={control}
                    name={`prompts.questions.${index}.question`}
                    render={({ field, fieldState }) => (
                      <Input
                        id={`prompts.questions.${index}.question`}
                        {...field}
                        aria-invalid={fieldState.invalid}
                      />
                    )}
                  />
                  <button
                    type="button"
                    className="hover:text-destructive cursor-pointer transition-colors"
                    onClick={() => remove(index)}
                  >
                    <Trash size={17} />
                  </button>
                </li>
              ))}
            </ul>
            <Button
              className="w-auto! self-start!"
              type="button"
              variant="secondary"
              onClick={() => append({ question: "" })}
            >
              <CirclePlus />
              Add one
            </Button>
          </Field>
        </FieldGroup>
      </FieldSet>
    </>
  );
}
