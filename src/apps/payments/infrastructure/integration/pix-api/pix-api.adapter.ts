/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

import { injectable } from "inversify";
import PixApiUnavailableException from "@/apps/payments/application/exceptions/pix-api-unavailable.exception";
import IPixApi, {
  PixDetailsResult,
} from "@/apps/payments/application/ports/pix-api.interface";
import Account from "@/apps/payments/domain/value-objects/account";
import Bank from "@/apps/payments/domain/value-objects/bank";
import PixKey from "@/apps/payments/domain/value-objects/pix-key";
import { PixDetailsResponse } from "@/apps/payments/infrastructure/integration/pix-api/types";
import IExceptionHandler from "@/libs/api-gateway/exception-handler.interface";
import NotFoundException from "@/libs/common/exceptions/not-found.exception";
import IConfig from "@/libs/core/config/config.interface";
import ILogger from "@/libs/core/logger/logger.interface";
import OnModuleInit from "@/libs/core/module/lifecycle/on-module-init.interface";

@injectable()
export default class PixApiAdapter implements IPixApi, OnModuleInit {
  private pixApiUrl!: string;
  private pixApiSecret!: string;

  constructor(
    private readonly config: IConfig,
    private readonly logger: ILogger,
    private readonly exceptionHandler: IExceptionHandler
  ) {}

  onModuleInit() {
    this.pixApiUrl = this.config.getOrThrow("PIX_API_URL");
    this.pixApiSecret = this.config.getOrThrow("PIX_API_SECRET");

    this.exceptionHandler.register(PixApiUnavailableException, 503);
  }

  async retrieveDetails(pixKey: PixKey): Promise<PixDetailsResult> {
    this.logger.debug(`[PIXAPI] Retrieving pix key details: ${pixKey.value}`);

    const response = await this.request<PixDetailsResponse>("/pixKey", "GET", {
      pixKey: pixKey.value,
    });

    const pixKeyDetails = response[pixKey.value];
    if (!pixKeyDetails) {
      throw new NotFoundException(`Pix key not found: ${pixKey.value}`);
    }

    const { account, bank } = pixKeyDetails;

    return {
      account: Account.create(account),
      bank: Bank.create(bank),
    };
  }

  private async request<T>(
    route: string,
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
    params: Record<string, unknown> = {}
  ): Promise<T> {
    // This is a simplified version of the params handling.
    const urlParams = new URLSearchParams();
    let bodyParams: string | undefined;

    // This is a simplified version of the HTTP Method handling.
    if (method === "GET") {
      for (const key in params) {
        urlParams.append(key, String(params[key]));
      }
    } else {
      bodyParams = JSON.stringify(params);
    }

    // Generate the full URL
    const fullUrl = `${this.pixApiUrl}${route}?${urlParams}`;

    // This is a simplified version of the request method.
    // In a real-world scenario, I would add more error handling and logging.
    let result: globalThis.Response | undefined;

    try {
      result = await fetch(fullUrl, {
        method,
        headers: {
          Authorization: `Bearer ${this.pixApiSecret}`,
          "Content-Type": "application/json",
        },
        body: bodyParams,
      });
    } catch (error) {
      this.logger.error(`[PIXAPI] Could not fetch: ${error}`);

      throw new PixApiUnavailableException();
    }

    // Here I could improve the error handling by creating custom exceptions.
    // For now, I'm just throwing a generic error.
    if (!result.ok) {
      throw new Error("Pix API request failed.");
    }

    return result.json() as Promise<T>;
  }
}
