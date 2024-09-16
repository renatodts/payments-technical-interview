/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

import { injectable } from "inversify";
import IInternalDependency from "@/libs/core/application/internal-dependency.interface";
import ILogger from "@/libs/core/logger/logger.interface";
import { EsmChalk } from "@/libs/core/logger/types";

@injectable()
export default class Logger implements ILogger, IInternalDependency {
  private esmChalk!: EsmChalk;

  async initialize() {
    this.esmChalk = (await import("chalk")).default;
  }

  debug(message: string): void {
    return this.log(message, "DEBUG");
  }

  info(message: string): void {
    return this.log(message, "INFO");
  }

  warn(message: string): void {
    return this.log(message, "WARN");
  }

  error(message: any): void {
    return this.log(String(message), "ERROR");
  }

  bold(message: string): string {
    return this.esmChalk.bold(message);
  }

  blueBright(message: string): string {
    return this.esmChalk.blueBright(message);
  }

  greenBright(message: string): string {
    return this.esmChalk.greenBright(message);
  }

  yellowBright(message: string): string {
    return this.esmChalk.yellowBright(message);
  }

  redBright(message: string): string {
    return this.esmChalk.redBright(message);
  }

  whiteBright(message: string): string {
    return this.esmChalk.whiteBright(message);
  }

  gray(message: string): string {
    return this.esmChalk.gray(message);
  }

  private log(
    message: string,
    level: "DEBUG" | "INFO" | "WARN" | "ERROR"
  ): void {
    const prefix = `[${this.esmChalk.bold(
      `${level}`
    )}] ${new Date().toLocaleString()}`;

    const log = this.gray(message);

    switch (level) {
      case "DEBUG":
        console.debug(this.blueBright(prefix) + " " + log);
        break;
      case "INFO":
        console.info(this.greenBright(prefix) + " " + log);
        break;
      case "WARN":
        console.warn(this.yellowBright(prefix) + " " + log);
        break;
      case "ERROR":
        console.error(this.redBright(prefix) + " " + log);
        break;
    }
  }
}
