import {Entity, Column, PrimaryGeneratedColumn, ManyToOne} from "typeorm";
import {Order} from "./Order";
import {Product} from "../product/Product";

@Entity()
export class OrderItem {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column({type: "int"})
    public orderId: number;

    @Column({type: "int"})
    public productId: number;

    @Column({type: "int"})
    public quantity: number;

    @Column({type: "float"})
    public unitPrice: number;

    @ManyToOne(() => Order, order => order.orderItems, { onDelete: 'CASCADE' })
    public order: Order;

    @ManyToOne(() => Product, { eager: true })
    public product: Product;

    constructor(productId: number, quantity: number, unitPrice: number) {
        if (quantity <= 0) {
            throw new Error("la quantité doit être supérieure à 0");
        }

        if (quantity > 10) {
            throw new Error("la quantité ne peut pas dépasser 10 unités");
        }

        this.productId = productId;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
    }

    incrementQuantity(amount: number): void {
        const newQuantity = this.quantity + amount;

        if (newQuantity > 10) {
            throw new Error("la quantité ne peut pas dépasser 10 unités");
        }

        this.quantity = newQuantity;
    }

    getSubtotal(): number {
        return this.quantity * this.unitPrice;
    }
}
