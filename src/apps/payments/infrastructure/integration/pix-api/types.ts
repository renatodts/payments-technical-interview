/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

export interface PixDetailsResponse {
  [pixKey: string]: {
    account: string;
    bank: string;
  };
}
