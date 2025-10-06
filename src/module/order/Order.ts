import {Entity, Column, PrimaryGeneratedColumn, OneToMany} from "typeorm";
import {OrderItem} from "./OrderItem";
import {Product} from "../product/Product";

@Entity()
export class Order {

    @PrimaryGeneratedColumn()
    public id: number;

    @OneToMany(() => OrderItem, item => item.order, { cascade: true, eager: true })
    public orderItems: OrderItem[];

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    public createdAt: Date;

    constructor() {
        this.orderItems = [];
    }

    totalAmount(): number {
        return this.orderItems.reduce((total, item) => total + item.getSubtotal(), 0);
    }

    distinctProductCount(): number {
        return this.orderItems.length;
    }

    canAddProduct(product: Product, quantity: number): { allowed: boolean, reason?: string } {
        // Vérifier si le produit existe déjà
        const existingItem = this.orderItems.find(item => item.productId === product.id);

        if (existingItem) {
            // Vérifier la limite de quantité
            const newQuantity = existingItem.quantity + quantity;
            if (newQuantity > 10) {
                return {
                    allowed: false,
                    reason: "la quantité ne peut pas dépasser 10 unités"
                };
            }
        } else {
            // Nouveau produit - vérifier la limite de 5 produits distincts
            if (this.orderItems.length >= 5) {
                return {
                    allowed: false,
                    reason: "le nombre maximum de produits distincts (5) est atteint"
                };
            }
        }

        // Vérifier la limite du montant total (500€)
        const potentialNewAmount = this.totalAmount() + (product.price * quantity);
        if (potentialNewAmount > 500) {
            return {
                allowed: false,
                reason: "le montant total ne doit pas dépasser 500€"
            };
        }

        return { allowed: true };
    }

    addProduct(product: Product, quantity: number): void {
        const check = this.canAddProduct(product, quantity);

        if (!check.allowed) {
            throw new Error(check.reason);
        }

        // Vérifier si le produit existe déjà
        const existingItem = this.orderItems.find(item => item.productId === product.id);

        if (existingItem) {
            // Incrémenter la quantité
            existingItem.incrementQuantity(quantity);
        } else {
            // Ajouter un nouveau OrderItem
            const newItem = new OrderItem(product.id, quantity, product.price);
            this.orderItems.push(newItem);
        }
    }
}
