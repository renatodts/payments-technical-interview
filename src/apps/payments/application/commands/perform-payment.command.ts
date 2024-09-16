/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

import Command from "@/libs/cqrs/command";

export type PerformPaymentResult = {
  id: string;
  status: string;
  payerId: string;
  amount: number;
  pixKey: string;
  account: string;
  bank: string;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string | null;
};

export default class PerformPaymentCommand extends Command<PerformPaymentResult> {
  constructor(
    public readonly payerId: string,
    public readonly pixKey: string,
    public readonly amount: number //
  ) {
    super();
  }
}
