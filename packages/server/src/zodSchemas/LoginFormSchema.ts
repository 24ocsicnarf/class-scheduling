import { ZodType, z, TypeOf } from "zod";

const schema = z.object({
  username: z.string(),
  password: z.string(),
});

export const LoginFormSchema: ZodType<LoginFormData> = schema;
export type LoginFormData = TypeOf<typeof schema>;
