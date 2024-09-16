/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

import { Request, Response } from "express";

export type IRouteInput =
  | `GET ${string}`
  | `POST ${string}`
  | `PUT ${string}`
  | `DELETE ${string}`;

export type IRouteHandler = (req: Request, res: Response) => void;

export type IRouteAssign<T extends string | symbol = string | symbol> = [
  IRouteInput,
  T
];

export type IExceptionRegistryDefinition =
  | {
      statusCode: number;
      message: string | ((error: any) => string);
    }
  | number;

export type IExceptionRegistryDefinitionMap = Map<
  Type<Error>,
  IExceptionRegistryDefinition
>;
