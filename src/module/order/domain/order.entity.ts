import {Entity, Column, PrimaryGeneratedColumn, OneToMany} from "typeorm"
import {OrderItem} from "./order-item.entity";


@Entity()
export class Order {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column({nullable: true, type: "date"})
    public createdAt: Date;

    @Column({nullable: true, type: "float"})
    public amount: number;

    @OneToMany(type => OrderItem, item => item.order, {cascade: true})
    public items: OrderItem[];

    constructor(sku: string, quantity: number) {
        this.createdAt = new Date();
        this.items = [];

        this.addItem(sku, quantity);
    }

    addItem(sku: string, quantity: number) {

        if (quantity < 0) {
            throw new Error("quantity must be greater than 0");
        }


        if (quantity > 4) {
            throw new Error("quantity must be greater than 4");
        }

        const existingItem = this.items?.find(i => i.sku === sku);

        if (existingItem) {
            existingItem.quantity += quantity;
            return;
        }

        const newItem = new OrderItem();
        newItem.sku = sku;
        newItem.quantity = quantity;

        this.items.push(newItem);
    }
}