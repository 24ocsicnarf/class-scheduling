import { TRPCClientErrorLike } from "@trpc/client";
import { FieldValues, UseFormReturn } from "react-hook-form";
import { AppRouter } from "server";

export const useFormDialog = <TFieldValues extends FieldValues = FieldValues>(
  form: UseFormReturn<TFieldValues>
) => {
  const setFormError = (
    error: TRPCClientErrorLike<AppRouter>,
    variables: {}
  ) => {
    if (error.data?.zodError) {
      const { zodError } = error.data;
      const fields = Object.keys(variables);
      fields.forEach((field) => {
        if (field in zodError.fieldErrors) {
          form.setError(field as keyof typeof variables, {
            message: zodError.fieldErrors[field]?.join("; "),
          });
        }
      });
    }
  };

  return [setFormError] as const;
};
