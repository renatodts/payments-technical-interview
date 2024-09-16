/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

import Account from "@/apps/payments/domain/value-objects/account";
import Bank from "@/apps/payments/domain/value-objects/bank";
import PixKey from "@/apps/payments/domain/value-objects/pix-key";

export interface PixDetailsResult {
  account: Account;
  bank: Bank;
}

export default abstract class IPixApi {
  abstract retrieveDetails(pixKey: PixKey): Promise<PixDetailsResult>;
}
