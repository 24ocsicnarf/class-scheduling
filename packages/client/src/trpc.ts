import {
  createTRPCReact,
  inferReactQueryProcedureOptions,
} from "@trpc/react-query";
import type { AppRouter } from "server";

export type ReactQueryOptions = inferReactQueryProcedureOptions<AppRouter>;
export const trpc = createTRPCReact<AppRouter>();
