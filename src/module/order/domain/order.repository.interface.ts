import {Order} from "./order.entity";

export default interface OrderRepositoryInterface {
    findOneById(id: number): Promise<Order>;
    save(order: Order): Promise<Order>;
}