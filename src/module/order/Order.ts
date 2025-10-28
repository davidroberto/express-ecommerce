import {Entity, Column, PrimaryGeneratedColumn} from "typeorm";

export interface OrderItem {
    productId: number;
    quantity: number;
}

@Entity()
export class Order {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column({type: "json", nullable: true})
    public items: OrderItem[];

    @Column({type: "float", default: 0})
    public totalAmount: number;

    constructor({id, items, totalAmount}: {id?: number, items: OrderItem[], totalAmount: number}) {
        if (id) {
            this.id = id;
        }
        this.items = items;
        this.totalAmount = totalAmount;
    }

    addProduct(productId: number, quantity: number): void {
        // Minimal implementation to make test pass
        const existingItem = this.items.find(item => item.productId === productId);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            if (this.items.length >= 5) {
                throw new Error("nombre maximum de produits atteint");
            }
            this.items.push({productId, quantity});
        }
    }

}
