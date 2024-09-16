/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

import { injectable } from "inversify";
import Middleware from "@/libs/api-gateway/middleware.interface";
import IConfig from "@/libs/core/config/config.interface";
import ILogger from "@/libs/core/logger/logger.interface";
import OnModuleInit from "@/libs/core/module/lifecycle/on-module-init.interface";
import { Request, Response } from "express";

@injectable()
export default class AuthenticationMiddleware
  implements Middleware, OnModuleInit
{
  private mockAuthToken!: string;

  constructor(
    private readonly logger: ILogger,
    private readonly config: IConfig
  ) {}

  onModuleInit() {
    this.mockAuthToken = this.config.getOrThrow("API_AUTH_TOKEN");
  }

  // This is a mock. In a real-world scenario, this would use a JWT library.
  // I'm using this to demonstrate how to attach data to the request object.
  // This data could be used in the controller to perform actions based on the user.
  // For example, if the user is an admin, they could have access to more features.
  // If the user is a regular user, they could have access to fewer features.
  async handle(req: Request, res: Response) {
    const jwtToken = req.headers.authorization?.split(" ")[1];

    if (!jwtToken) {
      this.logger.debug("[AUTH] No token provided");

      res.status(401).send({
        message: "No token provided",
      });

      return;
    }

    // Get user data from token.
    let user: ExpressUser | null = null;
    try {
      user = await this.parseJwtToken(jwtToken);
    } catch (error) {
      this.logger.error(`[AUTH] Error parsing token: ${String(error)}`);

      res.status(500).send({
        message: "Error parsing token",
      });

      return;
    }

    // Invalid token.
    if (!user) {
      this.logger.debug("[AUTH] Invalid token");

      res.status(401).send({
        message: "Invalid token",
      });

      return;
    }

    // Attach user data to request object.
    req.user = user;
    req.isAuthenticated = true;

    this.logger.debug("[AUTH] Token is valid. Proceeding...");
  }

  private async parseJwtToken(jwtToken: string): Promise<ExpressUser | null> {
    // This is a mock.
    if (jwtToken !== this.mockAuthToken) {
      return null;
    }

    return {
      id: "abc123",
      firstName: "John",
      lastName: "Doe",
      email: "john@doe.com",
      role: "admin",
    };
  }
}
