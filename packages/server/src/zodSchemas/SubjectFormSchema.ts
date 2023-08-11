import { TypeOf, ZodType, z } from "zod";
export const SubjectFormObject = z
  .object({
    id: z.number(),
    subjectName: z.string().trim().min(1, "Required"),
    subjectShortName: z.string().trim().min(1, "Required")?.max(20, "Too long"),
    colorHex: z
      .string()
      .trim()
      .min(1, "Required")
      .regex(RegExp("#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"), "Invalid color hex"),
    subjectCategoryId: z.number(),
  })
  .partial({
    id: true,
  });

export type SubjectFormData = TypeOf<typeof SubjectFormObject>;
export const SubjectFormSchema: ZodType<SubjectFormData> = SubjectFormObject;
