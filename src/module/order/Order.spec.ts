import {describe, expect, test} from "@jest/globals";
import {Order} from "./Order";
import {Product} from "../product/Product";

describe("Order Entity", () => {

    test("Scénario 1: création réussie (commande vide)", () => {
        // Étant donné que je créé une nouvelle commande
        const order = new Order();

        // Alors la commande doit être vide
        expect(order.orderItems).toEqual([]);
        expect(order.totalAmount()).toBe(0);
        expect(order.distinctProductCount()).toBe(0);
    });

    test("Scénario 2: totalAmount() calcule la somme des OrderItem.getSubtotal()", () => {
        // Étant donné une commande avec 2 produits
        const order = new Order();
        const product1 = new Product("Produit A", "Description", 50);
        product1.id = 1;
        const product2 = new Product("Produit B", "Description", 100);
        product2.id = 2;

        order.addProduct(product1, 2); // 2 * 50 = 100
        order.addProduct(product2, 1); // 1 * 100 = 100

        // Quand je calcule le montant total
        const total = order.totalAmount();

        // Alors le total doit être 200
        expect(total).toBe(200);
    });

    test("Scénario 3: distinctProductCount() compte les produits uniques", () => {
        // Étant donné une commande avec 3 produits distincts
        const order = new Order();
        const product1 = new Product("Produit A", "Description", 50);
        product1.id = 1;
        const product2 = new Product("Produit B", "Description", 100);
        product2.id = 2;
        const product3 = new Product("Produit C", "Description", 75);
        product3.id = 3;

        order.addProduct(product1, 2);
        order.addProduct(product2, 1);
        order.addProduct(product3, 3);

        // Quand je compte les produits distincts
        const count = order.distinctProductCount();

        // Alors le compte doit être 3
        expect(count).toBe(3);
    });

    test("Scénario 4: addProduct() ajoute nouveau produit avec succès", () => {
        // Étant donné une commande vide
        const order = new Order();
        const product = new Product("Produit A", "Description", 50);
        product.id = 1;

        // Quand j'ajoute un produit
        order.addProduct(product, 2);

        // Alors la commande doit contenir le produit
        expect(order.orderItems.length).toBe(1);
        expect(order.orderItems[0].productId).toBe(1);
        expect(order.orderItems[0].quantity).toBe(2);
        expect(order.orderItems[0].unitPrice).toBe(50);
    });

    test("Scénario 5: addProduct() incrémente quantité si produit existe déjà", () => {
        // Étant donné une commande contenant déjà le produit 1 avec quantité 2
        const order = new Order();
        const product = new Product("Produit A", "Description", 50);
        product.id = 1;
        order.addProduct(product, 2);

        // Quand j'ajoute à nouveau le même produit avec quantité 3
        order.addProduct(product, 3);

        // Alors la quantité doit être incrémentée à 5
        expect(order.orderItems.length).toBe(1); // Toujours 1 seul produit distinct
        expect(order.orderItems[0].quantity).toBe(5);
    });

    test("Scénario 6: addProduct() échoue si 6ème produit distinct (max 5)", () => {
        // Étant donné une commande contenant déjà 5 produits distincts
        const order = new Order();
        for (let i = 1; i <= 5; i++) {
            const product = new Product(`Produit ${i}`, "Description", 50);
            product.id = i;
            order.addProduct(product, 1);
        }

        // Quand j'essaie d'ajouter un 6ème produit distinct
        const product6 = new Product("Produit 6", "Description", 50);
        product6.id = 6;

        // Alors une erreur doit être levée
        expect(() => {
            order.addProduct(product6, 1);
        }).toThrow("le nombre maximum de produits distincts (5) est atteint");
    });

    test("Scénario 7: addProduct() échoue si montant total > 500€", () => {
        // Étant donné une commande avec un montant de 450€
        const order = new Order();
        const product1 = new Product("Produit A", "Description", 450);
        product1.id = 1;
        order.addProduct(product1, 1);

        // Quand j'essaie d'ajouter un produit de 100€ (total = 550€)
        const product2 = new Product("Produit B", "Description", 100);
        product2.id = 2;

        // Alors une erreur doit être levée
        expect(() => {
            order.addProduct(product2, 1);
        }).toThrow("le montant total ne doit pas dépasser 500€");
    });

    test("Scénario 8: addProduct() échoue si quantité résultante > 10", () => {
        // Étant donné une commande contenant le produit 1 avec quantité 8
        const order = new Order();
        const product = new Product("Produit A", "Description", 50);
        product.id = 1;
        order.addProduct(product, 8);

        // Quand j'essaie d'ajouter 3 unités supplémentaires (total = 11)
        // Alors une erreur doit être levée
        expect(() => {
            order.addProduct(product, 3);
        }).toThrow("la quantité ne peut pas dépasser 10 unités");
    });

});
