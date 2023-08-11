import { authMiddleware } from "./middlewares/authMiddleware";
import { t } from "./t";

export const router = t.router;

export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(authMiddleware);

(BigInt.prototype as any).toJSON = function () {
  return Number(this);
};
