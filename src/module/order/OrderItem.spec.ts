import {describe, expect, test} from "@jest/globals";
import {OrderItem} from "./OrderItem";

describe("OrderItem Entity", () => {

    test("Scénario 1: création réussie avec quantité valide (1-10)", () => {
        // Étant donné une quantité valide
        const quantity = 5;
        const unitPrice = 50;
        const productId = 1;

        // Quand je créé un OrderItem
        const orderItem = new OrderItem(productId, quantity, unitPrice);

        // Alors l'OrderItem doit être créé avec les bonnes valeurs
        expect(orderItem.productId).toBe(productId);
        expect(orderItem.quantity).toBe(quantity);
        expect(orderItem.unitPrice).toBe(unitPrice);
    });

    test("Scénario 2: échec si quantité = 0", () => {
        // Étant donné une quantité de 0
        const quantity = 0;
        const unitPrice = 50;
        const productId = 1;

        // Quand je créé un OrderItem avec quantité 0
        // Alors une erreur doit être levée
        expect(() => {
            new OrderItem(productId, quantity, unitPrice);
        }).toThrow("la quantité doit être supérieure à 0");
    });

    test("Scénario 3: échec si quantité > 10", () => {
        // Étant donné une quantité de 11
        const quantity = 11;
        const unitPrice = 50;
        const productId = 1;

        // Quand je créé un OrderItem avec quantité 11
        // Alors une erreur doit être levée
        expect(() => {
            new OrderItem(productId, quantity, unitPrice);
        }).toThrow("la quantité ne peut pas dépasser 10 unités");
    });

    test("Scénario 4: incrementQuantity() réussit si total <= 10", () => {
        // Étant donné un OrderItem avec quantité 5
        const orderItem = new OrderItem(1, 5, 50);

        // Quand j'incrémente la quantité de 3 (total = 8)
        orderItem.incrementQuantity(3);

        // Alors la quantité doit être 8
        expect(orderItem.quantity).toBe(8);
    });

    test("Scénario 5: incrementQuantity() échoue si total > 10", () => {
        // Étant donné un OrderItem avec quantité 8
        const orderItem = new OrderItem(1, 8, 50);

        // Quand j'essaie d'incrémenter de 3 (total = 11)
        // Alors une erreur doit être levée
        expect(() => {
            orderItem.incrementQuantity(3);
        }).toThrow("la quantité ne peut pas dépasser 10 unités");
    });

    test("Scénario 6: getSubtotal() retourne quantity * unitPrice", () => {
        // Étant donné un OrderItem avec quantité 5 et prix unitaire 50
        const orderItem = new OrderItem(1, 5, 50);

        // Quand je calcule le sous-total
        const subtotal = orderItem.getSubtotal();

        // Alors le sous-total doit être 250
        expect(subtotal).toBe(250);
    });

});
