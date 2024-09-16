/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

import { injectable } from "inversify";
import Payment from "@/apps/payments/domain/payment";
import IMonthlyPaymentsRepository from "@/apps/payments/domain/repositories/monthly-payments-repository.interface";
import PayerId from "@/apps/payments/domain/value-objects/payer-id";

@injectable()
export default class InMemoryMonthlyPaymentsRepository
  implements IMonthlyPaymentsRepository
{
  // This is a simple in-memory implementation of the repository. It's used
  // to store the monthly payments in memory. It's not a good idea to use this
  // in production because it's not persistent and it's not scalable.
  private monthlyPaymentsMap: Map<string, [number, number, Payment[]][]> =
    new Map();

  async upsert(payment: Payment): Promise<void> {
    const { payerId, year, month, payerMonths, currentMonth } =
      this.resolveMonthlyPaymentsDetailsForPayment(payment);

    if (currentMonth) {
      this.processCurrentMonthPayments(currentMonth, payment);
    } else {
      this.processAddNewPaymentToPayerMonths(year, month, payerMonths, payment);
    }

    // Update the map with the new monthly payments.
    this.monthlyPaymentsMap.set(payerId, payerMonths);
  }

  // Resolve the monthly payments details for the payment.
  private resolveMonthlyPaymentsDetailsForPayment(payment: Payment) {
    // Prepare the payment details.
    const payerId = payment.payerId.toString();
    const createdAt = payment.createdAt.toDate();
    const year = createdAt.getFullYear();
    const month = createdAt.getMonth() + 1;

    // Prepare the monthly payments details.
    const payerMonths = this.monthlyPaymentsMap.get(payerId) || [];
    const currentMonth = payerMonths.find(
      ([y, m]) => y === year && m === month
    );

    return {
      payerId,
      year,
      month,
      payerMonths,
      currentMonth,
    };
  }

  // Process the current month payments.
  private processCurrentMonthPayments(
    currentMonth: [number, number, Payment[]],
    payment: Payment
  ) {
    const existingPaymentIndex = currentMonth[2].findIndex(
      (p) => p.paymentId.value === payment.paymentId.value
    );

    if (existingPaymentIndex >= 0) {
      currentMonth[2][existingPaymentIndex] = payment;
    } else {
      currentMonth[2].push(payment);
    }
  }

  // Process the add new payment to payer months.
  private processAddNewPaymentToPayerMonths(
    year: number,
    month: number,
    payerMonths: [number, number, Payment[]][],
    payment: Payment
  ) {
    payerMonths.push([year, month, [payment]]);
  }

  // This is async because it's a repository method. In a real-world scenario,
  // this method would be async because it would fetch the data from a database.
  async findMonthlyPaymentsByPayerId(
    payerId: PayerId,
    year: number,
    month: number
  ): Promise<Payment[]> {
    const payerMonths = this.monthlyPaymentsMap.get(payerId.toString()) || [];

    const monthlyPayments = payerMonths.find(
      ([y, m]) => y === year && m === month
    );

    return monthlyPayments ? monthlyPayments[2] : [];
  }

  // Here I could sum only the payments that are completed or not canceled
  // based on the business rules. For this example, I'm summing all payments.
  async sumAmountByPayerId(
    payerId: PayerId,
    year: number,
    month: number
  ): Promise<number> {
    const payments = await this.findMonthlyPaymentsByPayerId(
      payerId,
      year,
      month
    );

    return payments.reduce(
      (sum, payment) => sum + payment.amount.toNumber(),
      0
    );
  }
}
