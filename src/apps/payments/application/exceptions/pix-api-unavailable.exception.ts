/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

import Exception from "@/libs/core/exception/exception";

export default class PixApiUnavailableException extends Exception {
  constructor() {
    super(
      "Pix Api unavailable. Please make sure the external api is up and running."
    );
  }
}
