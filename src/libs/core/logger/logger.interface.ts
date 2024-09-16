/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

export default abstract class ILogger {
  abstract info(message: string): void;
  abstract error(errorOrMessage: any): void;
  abstract warn(message: string): void;
  abstract debug(message: string): void;

  abstract bold(message: string): string;
  abstract blueBright(message: string): string;
  abstract greenBright(message: string): string;
  abstract yellowBright(message: string): string;
  abstract redBright(message: string): string;
  abstract whiteBright(message: string): string;
  abstract gray(message: string): string;
}
