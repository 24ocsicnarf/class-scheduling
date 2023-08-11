import { TypeOf, ZodType, z } from "zod";
export const TeacherFormObject = z
  .object({
    id: z.number(),
    firstName: z.string().trim().min(1, "Required"),
    middleName: z.string().trim(),
    lastName: z.string().trim().min(1, "Required"),
    nameSuffix: z.string().trim(),
    nickname: z.string().trim().min(1, "Required"),
    shortHonorific: z.string().trim().min(1, "Required").max(16, "Too long"),
    sex: z.number(),
  })
  .partial({
    id: true,
    middleName: true,
    nameSuffix: true,
  });

export type TeacherFormData = TypeOf<typeof TeacherFormObject>;
export const TeacherFormSchema: ZodType<TeacherFormData> = TeacherFormObject;
