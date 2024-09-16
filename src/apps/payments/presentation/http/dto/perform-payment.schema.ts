/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

import z from "zod";

export const PerformPaymentSchema = z.object({
  pixKey: z.string(),
  amount: z.number().min(0.01),
});
