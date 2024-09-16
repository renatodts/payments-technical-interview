/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

import { Subject } from "rxjs";
import { injectable } from "inversify";
import IRequest from "@/libs/common/utils/request-bus/request.interface";
import IResponse from "@/libs/common/utils/request-bus/response.interface";
import RequestHandler from "@/libs/common/utils/request-bus/request-handler.interface";

@injectable()
export default abstract class RequestBus<Value = unknown> {
  protected subject$ = new Subject<IRequest<Value> | IResponse<unknown>>();
  protected nextId = 0;

  register<Response = unknown>(
    valueType: Type<unknown>,
    handler: RequestHandler<Response, Value>
  ): void {
    this.subject$.subscribe({
      next: (request: IRequest<Value> | IResponse<unknown>) => {
        if (!("__isRequest" in request) || !request.__isRequest) {
          return;
        }

        if (!(request.data instanceof valueType)) {
          return;
        }

        handler
          .handle(request.data)
          .then((data) => {
            this.subject$.next({
              __isResponse: true,
              id: request.id,
              data,
            });
          })
          .catch((error) => {
            this.subject$.next({
              __isResponse: true,
              id: request.id,
              data: undefined,
              error,
            });
          });
      },
    });
  }

  request<Response = unknown>(value: Value): Promise<Response> {
    const request = this.createRequest(value);

    this.subject$.next(request);

    return new Promise<Response>((resolve, reject) => {
      const subscription = this.subject$.subscribe({
        next: (response: IRequest<Value> | IResponse<unknown>) => {
          if (!("__isResponse" in response) || !response.__isResponse) {
            return;
          }

          if (response.id !== request.id) {
            return;
          }

          subscription.unsubscribe();

          if (!response.error) {
            resolve(response.data as Response);
          } else {
            reject(response.error);

            return;
          }
        },
        error: (error) => {
          // All response errors are sent with the response,
          // so these errors should be considered critical.
          subscription.unsubscribe();

          reject(error);
        },
      });
    });
  }

  protected createRequest(value: Value): IRequest<Value> {
    return {
      __isRequest: true,
      id: this.nextId++,
      data: value,
    };
  }
}
