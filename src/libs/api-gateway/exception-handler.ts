/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

import { Request, Response } from "express";
import { injectable } from "inversify";
import IExceptionHandler from "@/libs/api-gateway/exception-handler.interface";
import {
  IExceptionRegistryDefinition,
  IExceptionRegistryDefinitionMap,
} from "@/libs/api-gateway/types";
import ForbiddenException from "@/libs/common/exceptions/forbidden.exception";
import NotFoundException from "@/libs/common/exceptions/not-found.exception";
import ILogger from "@/libs/core/logger/logger.interface";
import OnModuleInit from "@/libs/core/module/lifecycle/on-module-init.interface";
import { ZodError } from "zod";

@injectable()
export default class ExceptionHandler
  implements IExceptionHandler, OnModuleInit
{
  private errorRegistryMap: IExceptionRegistryDefinitionMap = new Map();

  constructor(private readonly logger: ILogger) {}

  onModuleInit() {
    this.register(ForbiddenException, 403);
    this.register(NotFoundException, 404);

    this.register(ZodError, {
      statusCode: 400,
      message: (error: ZodError) => {
        const firstError = error.errors.shift();

        return firstError
          ? `Validation error: ${firstError.code} at ${firstError.path}: ${firstError.message}`
          : "Validation error";
      },
    });
  }

  register(
    errorClass: Type<Error>,
    registry: IExceptionRegistryDefinition
  ): void {
    this.errorRegistryMap.set(errorClass, registry);
  }

  // This method is responsible for handling errors and sending the appropriate
  // response to the client. I've made it simple for the sake of this example.
  async handle(error: any, req: Request, res: Response): Promise<void> {
    this.logger.error(error);

    const errorRegistryKeys = this.errorRegistryMap.keys();

    for (const errorRegistryKey of errorRegistryKeys) {
      if (!(error instanceof errorRegistryKey)) {
        continue;
      }

      const definitionOrStatusCode =
        this.errorRegistryMap.get(errorRegistryKey)!;

      if (typeof definitionOrStatusCode === "number") {
        res.status(definitionOrStatusCode).send({
          message: String(error),
        });
      } else {
        const { statusCode, message } = definitionOrStatusCode;

        res.status(statusCode).send({
          message: typeof message === "function" ? message(error) : message,
        });
      }

      return;
    }

    res.status(500).send({
      message: "Internal application error",
    });
  }
}
