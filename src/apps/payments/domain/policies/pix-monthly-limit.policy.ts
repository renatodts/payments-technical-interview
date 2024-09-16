/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

import { injectable } from "inversify";
import IMonthlyPaymentsRepository from "@/apps/payments/domain/repositories/monthly-payments-repository.interface";
import Amount from "@/apps/payments/domain/value-objects/amount";
import PayerId from "@/apps/payments/domain/value-objects/payer-id";

@injectable()
export default class PixMonthlyLimitPolicy {
  constructor(
    private readonly monthlyPaymentsRepository: IMonthlyPaymentsRepository
  ) {}

  async allows(
    payerId: PayerId,
    amount: Amount,
    year: number,
    month: number
  ): Promise<boolean> {
    const monthAmount = await this.monthlyPaymentsRepository.sumAmountByPayerId(
      payerId,
      year,
      month
    );
    const totalAmount = monthAmount + amount.toNumber();

    return totalAmount <= 30000;
  }
}
