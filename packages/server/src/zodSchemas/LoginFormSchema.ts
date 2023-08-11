import { ZodType, z, TypeOf } from "zod";

const schema = z.object({
  username: z.string(),
  password: z.string(),
});

export type LoginFormData = TypeOf<typeof schema>;
export const LoginFormSchema: ZodType<LoginFormData> = schema;
