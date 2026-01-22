import { Field, Response } from "@/prisma/src/generated/prisma/client";
import { TransformedResponse } from "./types";

export const transformResponses = (
  responses: Response[],
  fields: Field[],
): TransformedResponse[] => {
  const fieldMap = fields.reduce(
    (acc, field) => {
      acc[field.field_key] = field;
      return acc;
    },
    {} as Record<string, Field>,
  );

  return responses.map((response) => {
    const answers = response.answers ?? {};
    const transformedAnswers: TransformedResponse["answers"] = {};

    Object.entries(answers).forEach(([key, value]) => {
      const field = fieldMap[key];

      if (field && field.visibility === "public") {
        transformedAnswers[key] = {
          label: field.label,
          type: field.type,
          position: field.position,
          value,
        };
      }
    });

    return { ...response, answers: transformedAnswers };
  });
};
