import {OrderProduct} from "./OrderProduct";

export class Order {

    public id: number;

    public totalPrice: number;

    public orderProducts: OrderProduct[] = []

}