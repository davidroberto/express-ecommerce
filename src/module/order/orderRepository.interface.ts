import {Order} from "./Order";

export interface OrderRepository {
    findLast(): Promise<Order | null>;
}