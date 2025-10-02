import {Entity, Column, PrimaryGeneratedColumn, ManyToOne} from "typeorm"
import {Order} from "./order.entity";


@Entity()
export class OrderItem {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({nullable: true, type: "varchar"})
    public sku: string;

    @Column({nullable: true, type: "float"})
    public quantity: number;

    @ManyToOne(type => Order, order => order.items, {onDelete: "CASCADE"})
    public order: Order;

}