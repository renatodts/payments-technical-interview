/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

export default class MaterializedPaymentEntity {
  constructor(
    public id: string,
    public status: string,
    public payerId: string,
    public amount: number,
    public pixKey: string,
    public account: string,
    public bank: string,
    public paidAt: string | null,
    public createdAt: string,
    public updatedAt: string | null
  ) {}
}
