/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

import Query from "@/libs/cqrs/query";

export type GetPaymentDetailsResult = {
  id: string;
  payerId: string;
  status: string;
  amount: number;
  pixKey: string;
  account: string;
  bank: string;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string | null;
};

export default class GetPaymentDetailsQuery extends Query<GetPaymentDetailsResult> {
  constructor(public readonly paymentId: string) {
    super();
  }
}
