export const UserStatus = {
  active: "active",
  inactive: "inactive",
} as const;

export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];
