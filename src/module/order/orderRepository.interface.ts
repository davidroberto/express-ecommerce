import {Order} from "./Order";

export interface OrderRepository {
    findById(id: number): Promise<Order | null>;
    save(order: Order): Promise<void>;
}
