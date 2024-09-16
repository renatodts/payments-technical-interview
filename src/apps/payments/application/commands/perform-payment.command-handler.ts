/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

import { injectable } from "inversify";
import PerformPaymentCommand, {
  PerformPaymentResult,
} from "@/apps/payments/application/commands/perform-payment.command";
import IPixApi from "@/apps/payments/application/ports/pix-api.interface";
import PixPaymentNotAllowedException from "@/apps/payments/domain/exceptions/pix-payment-not-allowed.exception";
import PaymentFactory from "@/apps/payments/domain/factories/payment.factory";
import Payment from "@/apps/payments/domain/payment";
import PixMonthlyLimitPolicy from "@/apps/payments/domain/policies/pix-monthly-limit.policy";
import PixTimeAmountPolicy from "@/apps/payments/domain/policies/pix-time-amount.policy";
import Amount from "@/apps/payments/domain/value-objects/amount";
import PayerId from "@/apps/payments/domain/value-objects/payer-id";
import PixKey from "@/apps/payments/domain/value-objects/pix-key";
import ILogger from "@/libs/core/logger/logger.interface";
import OnModuleInit from "@/libs/core/module/lifecycle/on-module-init.interface";
import ICommandBus from "@/libs/cqrs/command-bus.interface";
import ICommandHandler from "@/libs/cqrs/command-handler.interface";

@injectable()
export default class PerformPaymentCommandHandler
  implements ICommandHandler<PerformPaymentCommand>, OnModuleInit
{
  constructor(
    private readonly logger: ILogger,
    private readonly commandBus: ICommandBus,
    private readonly paymentFactory: PaymentFactory,
    private readonly pixApi: IPixApi,
    private readonly pixTimeAmountPolicy: PixTimeAmountPolicy,
    private readonly pixMonthlyLimitPolicy: PixMonthlyLimitPolicy
  ) {}

  onModuleInit() {
    // I could implement a decorator to assign commands to handlers,
    // but I'm doing it manually for the sake of simplicity.
    this.commandBus.register(PerformPaymentCommand, this);
  }

  async handle(command: PerformPaymentCommand): Promise<PerformPaymentResult> {
    this.logger.debug("[COMMANDHANDLER] Handling PerformPaymentCommand...");

    // Get the details of the PIX key.
    const pixKey = PixKey.create(command.pixKey);
    const { account, bank } = await this.pixApi.retrieveDetails(pixKey);

    // Here I'm considering that the date instance is based on the client's timezone.
    // In a real-world application, I would use a proper timezone mechanism to handle this.
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    const payerId = PayerId.create(command.payerId);
    const amount = Amount.create(command.amount);

    if (
      !this.pixTimeAmountPolicy.allows(amount, now) ||
      !(await this.pixMonthlyLimitPolicy.allows(
        payerId,
        amount,
        currentYear,
        currentMonth
      ))
    ) {
      // Here I'm throwing an exception to simulate a business rule violation.
      // In a real-world application, I would return a proper error message.
      throw new PixPaymentNotAllowedException();
    }

    const payment = this.paymentFactory.createPending(
      payerId,
      amount,
      pixKey,
      account,
      bank
    );

    await payment.commit();

    return this.generateResult(payment);
  }

  private generateResult(payment: Payment): PerformPaymentResult {
    return {
      id: payment.paymentId.toString(),
      status: payment.status.toString(),
      payerId: payment.payerId.toString(),
      amount: payment.amount.toNumber(),
      pixKey: payment.pixKey.toString(),
      account: payment.account.toString(),
      bank: payment.bank.toString(),
      paidAt: payment.paidAt.toStringOrNull(),
      createdAt: payment.createdAt.toString(),
      updatedAt: payment.updatedAt.toStringOrNull(),
    };
  }
}
