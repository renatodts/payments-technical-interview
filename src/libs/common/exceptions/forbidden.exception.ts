/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

import Exception from "@/libs/core/exception/exception";

export default class ForbiddenException extends Exception {
  constructor(message: string) {
    super(`Forbidden exception: ${message}`);
  }
}
