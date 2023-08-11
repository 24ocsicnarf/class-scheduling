import { TypeOf, ZodType, z } from "zod";
export const SeniorHighSectionFormObject = z
  .object({
    id: z.number(),
    classSectionName: z
      .string()
      .trim()
      .nonempty("Required")
      .max(60, "Too long"),
    seniorHighStrandId: z.number().nullable(),
    seniorHighTrackId: z.number(),
    yearLevelId: z.number(),
  })
  .partial({
    id: true,
    seniorHighStrandId: true,
  });

export type SeniorHighSectionFormData = TypeOf<
  typeof SeniorHighSectionFormObject
>;
export const SeniorHighSectionFormSchema: ZodType<SeniorHighSectionFormData> =
  SeniorHighSectionFormObject;
