/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

import { Request, Response } from "express";

export default interface Middleware {
  handle(req: Request, res: Response): Promise<void>;
}
