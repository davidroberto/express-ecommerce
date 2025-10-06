import {describe, expect, test} from "@jest/globals";
import {AddProductToOrderUsecase} from "./addProductToOrder.usecase";
import {OrderRepository} from "../orderRepository.interface";
import {ProductRepository} from "../../product/productRepository.interface";
import {Order} from "../Order";
import {Product} from "../../product/Product";

class DummyOrderRepository implements OrderRepository {
    private orders: Map<number, Order> = new Map();

    async findById(id: number): Promise<Order | null> {
        return this.orders.get(id) || null;
    }

    async save(order: Order): Promise<void> {
        this.orders.set(order.id, order);
    }

    // Helper pour les tests
    addOrder(order: Order): void {
        this.orders.set(order.id, order);
    }
}

class DummyProductRepository implements ProductRepository {
    private products: Map<number, Product> = new Map();

    async save(product: {price: number; title: string; description: string}): Promise<void> {
        // Not used in these tests
    }

    async findById(id: number): Promise<Product | null> {
        return this.products.get(id) || null;
    }

    // Helper pour les tests
    addProduct(product: Product): void {
        this.products.set(product.id, product);
    }
}

describe("US-X : Ajouter un produit à une commande", () => {

    test("Scénario 1: ajout réussi d'un nouveau produit", async () => {
        // Étant donné une commande vide et un produit existant
        const orderRepo = new DummyOrderRepository();
        const productRepo = new DummyProductRepository();

        const order = new Order();
        order.id = 10;
        orderRepo.addOrder(order);

        const product = new Product("Produit A", "Description", 50);
        product.id = 5;
        productRepo.addProduct(product);

        const usecase = new AddProductToOrderUsecase(orderRepo, productRepo);

        // Quand j'ajoute le produit 5 à la commande 10
        await usecase.execute({ orderId: 10, productId: 5, quantity: 2 });

        // Alors le produit doit être ajouté à la commande
        const updatedOrder = await orderRepo.findById(10);
        expect(updatedOrder?.orderItems.length).toBe(1);
        expect(updatedOrder?.orderItems[0].productId).toBe(5);
        expect(updatedOrder?.orderItems[0].quantity).toBe(2);
    });

    test("Scénario 2: incrémentation réussie d'un produit existant", async () => {
        // Étant donné une commande contenant déjà le produit 5 (quantité: 2)
        const orderRepo = new DummyOrderRepository();
        const productRepo = new DummyProductRepository();

        const order = new Order();
        order.id = 10;
        const product = new Product("Produit A", "Description", 50);
        product.id = 5;
        order.addProduct(product, 2);
        orderRepo.addOrder(order);
        productRepo.addProduct(product);

        const usecase = new AddProductToOrderUsecase(orderRepo, productRepo);

        // Quand j'ajoute à nouveau le produit 5 avec quantité 3
        await usecase.execute({ orderId: 10, productId: 5, quantity: 3 });

        // Alors la quantité doit être incrémentée à 5
        const updatedOrder = await orderRepo.findById(10);
        expect(updatedOrder?.orderItems.length).toBe(1);
        expect(updatedOrder?.orderItems[0].quantity).toBe(5);
    });

    test("Scénario 3: échec si commande inexistante (404)", async () => {
        // Étant donné qu'aucune commande n'existe avec l'identifiant 999
        const orderRepo = new DummyOrderRepository();
        const productRepo = new DummyProductRepository();

        const product = new Product("Produit A", "Description", 50);
        product.id = 5;
        productRepo.addProduct(product);

        const usecase = new AddProductToOrderUsecase(orderRepo, productRepo);

        // Quand j'essaie d'ajouter un produit à la commande 999
        // Alors une erreur doit être levée
        await expect(
            usecase.execute({ orderId: 999, productId: 5, quantity: 1 })
        ).rejects.toThrow("commande non trouvée");
    });

    test("Scénario 4: échec si produit inexistant (404)", async () => {
        // Étant donné une commande existante mais un produit inexistant
        const orderRepo = new DummyOrderRepository();
        const productRepo = new DummyProductRepository();

        const order = new Order();
        order.id = 10;
        orderRepo.addOrder(order);

        const usecase = new AddProductToOrderUsecase(orderRepo, productRepo);

        // Quand j'essaie d'ajouter le produit 9999 qui n'existe pas
        // Alors une erreur doit être levée
        await expect(
            usecase.execute({ orderId: 10, productId: 9999, quantity: 1 })
        ).rejects.toThrow("produit non trouvé");
    });

    test("Scénario 5: échec si 6ème produit distinct", async () => {
        // Étant donné une commande avec 5 produits distincts
        const orderRepo = new DummyOrderRepository();
        const productRepo = new DummyProductRepository();

        const order = new Order();
        order.id = 10;

        for (let i = 1; i <= 5; i++) {
            const product = new Product(`Produit ${i}`, "Description", 50);
            product.id = i;
            order.addProduct(product, 1);
            productRepo.addProduct(product);
        }
        orderRepo.addOrder(order);

        const product6 = new Product("Produit 6", "Description", 50);
        product6.id = 6;
        productRepo.addProduct(product6);

        const usecase = new AddProductToOrderUsecase(orderRepo, productRepo);

        // Quand j'essaie d'ajouter un 6ème produit distinct
        // Alors une erreur doit être levée
        await expect(
            usecase.execute({ orderId: 10, productId: 6, quantity: 1 })
        ).rejects.toThrow("le nombre maximum de produits distincts (5) est atteint");
    });

    test("Scénario 6: échec si montant total > 500€", async () => {
        // Étant donné une commande avec un montant de 450€
        const orderRepo = new DummyOrderRepository();
        const productRepo = new DummyProductRepository();

        const order = new Order();
        order.id = 10;

        const product1 = new Product("Produit Cher", "Description", 450);
        product1.id = 1;
        order.addProduct(product1, 1);
        orderRepo.addOrder(order);
        productRepo.addProduct(product1);

        const product2 = new Product("Produit 2", "Description", 100);
        product2.id = 2;
        productRepo.addProduct(product2);

        const usecase = new AddProductToOrderUsecase(orderRepo, productRepo);

        // Quand j'essaie d'ajouter un produit de 100€
        // Alors une erreur doit être levée
        await expect(
            usecase.execute({ orderId: 10, productId: 2, quantity: 1 })
        ).rejects.toThrow("le montant total ne doit pas dépasser 500€");
    });

    test("Scénario 7: échec si quantité > 10", async () => {
        // Étant donné une commande contenant le produit 5 avec quantité 8
        const orderRepo = new DummyOrderRepository();
        const productRepo = new DummyProductRepository();

        const order = new Order();
        order.id = 10;

        const product = new Product("Produit A", "Description", 50);
        product.id = 5;
        order.addProduct(product, 8);
        orderRepo.addOrder(order);
        productRepo.addProduct(product);

        const usecase = new AddProductToOrderUsecase(orderRepo, productRepo);

        // Quand j'essaie d'ajouter 3 unités supplémentaires
        // Alors une erreur doit être levée
        await expect(
            usecase.execute({ orderId: 10, productId: 5, quantity: 3 })
        ).rejects.toThrow("la quantité ne peut pas dépasser 10 unités");
    });

});
