import {describe, expect, test} from "@jest/globals";
import {AddProductToOrderUseCase} from "./addProductToOrder.usecase";
import {Product} from "../../product/Product";
import {ProductRepository} from "../../product/productRepository.interface";
import {Order} from "../Order";
import {OrderRepository} from "../orderRepository.interface";


class FakeProductRepository implements ProductRepository {

    async save(product: Product): Promise<void> {
        // No implementation needed for this test
    }

    async findOneBy(): Promise<Product | null> {
        return { id: 1, title: "Product 1", description: "test", price: 100 }
    }
}

class FakeOrderNotFoundRepository implements OrderRepository {

    async findLast(): Promise<Order | null> {
        return null;
    }
}

class FakeExistingOrderRepository implements OrderRepository {

    async findLast(): Promise<Order | null> {
        const order = new Order();

        const orderProduct = { productId: 1, quantity: 1 };
        order.orderProducts.push(orderProduct);
        order.totalPrice = 100;

        return order;
    }

}

describe("US-3 : Ajouter un produit à une commande",  () => {

    test("Scénario 1: ajout d'un produit réussi sur une nouvelle commande", async () => {

        const productId = 1;
        const quantity = 1;

        const productRepository = new FakeProductRepository();
        const orderRepository = new FakeOrderNotFoundRepository();

        const addProductToOrderUseCase = new AddProductToOrderUseCase(productRepository,orderRepository);
        const order = await addProductToOrderUseCase.execute(productId, quantity);

        expect(order).toBeDefined();
        expect(order.orderProducts.length).toBe(1);
        expect(order.orderProducts[0].productId).toBe(productId);
        expect(order.orderProducts[0].quantity).toBe(quantity);
        expect(order.totalPrice).toBe(100);
    });

    test("Scénario 2: ajout d'un produit réussi sur une commande existante", async () => {
        const productId = 1;
        const quantity = 2;

        const productRepository = new FakeProductRepository();
        const orderRepository = new FakeExistingOrderRepository();

        const addProductToOrderUseCase = new AddProductToOrderUseCase(productRepository,orderRepository);
        const order = await addProductToOrderUseCase.execute(productId, quantity);

        expect(order).toBeDefined();
        expect(order.orderProducts.length).toBe(1);
        expect(order.orderProducts[0].productId).toBe(productId);
        expect(order.orderProducts[0].quantity).toBe(3);
    });

});
