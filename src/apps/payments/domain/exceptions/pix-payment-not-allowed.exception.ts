/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

import ForbiddenException from "@/libs/common/exceptions/forbidden.exception";

export default class PixPaymentNotAllowedException extends ForbiddenException {
  constructor() {
    super("Pix payment is not allowed");
  }
}
