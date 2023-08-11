import { ZodType, z, TypeOf } from "zod";

export const UserPasswordSchema = z
  .string()
  .min(8, "Password should have at least 8 characters");

const schema = z.object({
  username: z.string().superRefine((val, ctx) => {
    if (val.length == 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.too_small,
        minimum: 1,
        type: "string",
        inclusive: true,
        message: "Username is required",
        fatal: true,
      });
      return z.NEVER;
    }

    if (!val.match(/\S/)) {
      ctx.addIssue({
        code: z.ZodIssueCode.invalid_string,
        validation: "regex",
        message: "Username must contain a letter, number, hyphen or underscore",
        fatal: true,
      });
      return z.NEVER;
    }

    if (!val.match(/^[a-zA-Z0-9]/)) {
      ctx.addIssue({
        code: z.ZodIssueCode.invalid_string,
        validation: "regex",
        message: "Username must start with a letter or number",
        fatal: true,
      });
      return z.NEVER;
    }

    if (!val.match(/^[a-zA-Z0-9-_]*$/)) {
      ctx.addIssue({
        code: z.ZodIssueCode.invalid_string,
        validation: "regex",
        message:
          "Username must only contain a letter, number, dash (-) or underscore (_)",
        fatal: true,
      });
      return z.NEVER;
    }
  }),
  password: UserPasswordSchema,
  roleId: z.number(),
});

export type UserPasswordData = TypeOf<typeof UserPasswordSchema>;

export const UserFormSchema: ZodType<UserFormData> = schema;
export type UserFormData = TypeOf<typeof schema>;
