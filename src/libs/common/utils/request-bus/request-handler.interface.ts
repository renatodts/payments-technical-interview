/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

export default interface RequestHandler<Response, Request = unknown> {
  handle(request: Request): Promise<Response>;
}
