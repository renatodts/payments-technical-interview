/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

declare interface ExpressUser {
  [key: string]: unknown;
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "admin" | "user";
}

declare namespace Express {
  export interface Request {
    requestId: number;
    isAuthenticated: boolean;
    user: ExpressUser;
  }
}
