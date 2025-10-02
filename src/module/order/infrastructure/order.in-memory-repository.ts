import OrderRepositoryInterface from "../domain/order.repository.interface";
import {Order} from "../domain/order.entity";

export class InMemoryOrderRepository implements OrderRepositoryInterface {
    private store = new Map<number, Order>();
    lastSaved?: Order;

    async findOneById(id: number): Promise<Order | null> {
        return this.store.get(id) ?? null;
    }

    async save(order: Order): Promise<Order> {
        this.store.set(order.id, order);
        this.lastSaved = order;
        return order;
    }
}