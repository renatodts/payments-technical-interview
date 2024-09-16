/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

import { Request, Response } from "express";
import { IExceptionRegistryDefinition } from "@/libs/api-gateway/types";

export default abstract class IExceptionHandler {
  abstract register(
    errorClass: Type<Error>,
    registry: IExceptionRegistryDefinition
  ): void;

  abstract handle(error: any, req: Request, res: Response): Promise<void>;
}
