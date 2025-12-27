import { ZodError } from "zod";

export const formatValidationError = (errors: ZodError): string => {
  if (!errors || !errors.issues) {
    return "Validation failed";
  }

  return errors.issues.map((issue) => issue.message).join(", ");
};
