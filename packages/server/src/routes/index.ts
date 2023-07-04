import { router } from "./../trpc";
import { authRouter } from "./auth";
import { dashboardRouter } from "./dashboard";

export const appRouter = router({
  auth: authRouter,
  dashboard: dashboardRouter,
});
