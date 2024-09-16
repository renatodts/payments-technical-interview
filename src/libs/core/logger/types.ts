/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

// This type was created to avoid ESM import issues.
export type EsmChalk = {
  bold: (message: string) => string;
  blueBright: (message: string) => string;
  greenBright: (message: string) => string;
  yellowBright: (message: string) => string;
  redBright: (message: string) => string;
  whiteBright: (message: string) => string;
  gray: (message: string) => string;
};
