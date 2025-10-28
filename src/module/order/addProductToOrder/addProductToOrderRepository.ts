import {Order} from "../Order";

export interface AddProductToOrderRepository {
    findById(orderId: number): Promise<Order | null>;
    save(order: Order): Promise<void>;
}
