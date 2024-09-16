/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

import { injectable } from "inversify";
import Amount from "@/apps/payments/domain/value-objects/amount";

@injectable()
export default class PixTimeAmountPolicy {
  allows(amount: Amount, now: Date) {
    const hour = now.getHours();

    // Rule 1: The amount must be less than or equal to 1000 BRL between 20:00 and 05:59.
    if (amount.value > 1000 && (hour >= 20 || hour < 6)) {
      return false;
    }

    // Rule 2: The amount must be less than or equal to 15000 BRL between 05:00 and 19:59.
    if (amount.value > 15000 && hour >= 5 && hour < 20) {
      return false;
    }

    return true;
  }
}
