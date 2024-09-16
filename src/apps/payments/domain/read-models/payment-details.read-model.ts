/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

// This is a read model that represents an aspect of the payment entity.
// It is used for optimized queries and to avoid joins in the persistence layer.
// I wouldn't use value objects because they were built for the
// Payment's AggregateRoot and not for read models.
export default class PaymentDetailsReadModel {
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
