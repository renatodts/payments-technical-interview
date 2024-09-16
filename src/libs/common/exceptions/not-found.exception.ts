/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

import Exception from "@/libs/core/exception/exception";

export default class NotFoundException extends Exception {
  constructor(message: string) {
    super(`Not found exception: ${message}`);
  }
}
