import { TypeOf, ZodType, z } from "zod";
const yearLevelFormSchema = z
  .object({
    id: z.number(),
    yearLevelName: z.string().trim().nonempty("Required"),
    yearLevelShortName: z
      .string()
      .trim()
      .nonempty("Required")
      ?.max(20, "Too long"),
  })
  .partial({
    id: true,
  });

export type YearLevelFormData = TypeOf<typeof yearLevelFormSchema>;
export const YearLevelFormSchema: ZodType<YearLevelFormData> =
  yearLevelFormSchema;
