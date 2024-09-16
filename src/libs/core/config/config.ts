/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

import { injectable } from "inversify";
import { config } from "dotenv";
import parseEnv from "dotenv-parse-variables";
import IInternalDependency from "@/libs/core/application/internal-dependency.interface";
import IConfig from "@/libs/core/config/config.interface";

@injectable()
export default class Config implements IConfig, IInternalDependency {
  private registry: Partial<Environment> = {};

  initialize() {
    const env = config();
    if (env.error) {
      throw env.error;
    }

    this.registry = parseEnv(env.parsed!);
  }

  get<K extends keyof Environment>(key: K): Environment[K] | undefined {
    return this.registry[key];
  }

  getOrThrow<K extends keyof Environment>(key: K): Environment[K] {
    const value = this.get(key);

    if (typeof value === "undefined") {
      throw new Error(`Missing environment variable: ${key as string}`);
    }

    return value;
  }
}
