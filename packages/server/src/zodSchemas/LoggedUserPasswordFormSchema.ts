import { ZodType, z, TypeOf } from "zod";
import { UserPasswordSchema } from "./UserFormSchema";

const schema = z.object({
  currentPassword: UserPasswordSchema,
  newPassword: UserPasswordSchema,
});

export const LoggedUserPasswordFormSchema: ZodType<LoggedUserPasswordFormData> =
  schema;
export type LoggedUserPasswordFormData = TypeOf<typeof schema>;
