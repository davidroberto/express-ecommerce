import OrderRepositoryInterface from "../domain/order.repository.interface";
import OrderTypeOrmRepository from "../infrastructure/order.type-orm-repository";
import {Order} from "../domain/order.entity";
import {describe, expect, test, beforeEach} from "@jest/globals";
import {AddItemToOrderUseCase} from "./add-item-to-order.use-case";
import {InMemoryOrderRepository} from "../infrastructure/order.in-memory-repository";

describe("US-1 : Cumuler les quantités pour un même article dans le panier",  () => {

    describe("AC-1", () => {

        let orderRepository: InMemoryOrderRepository;

        beforeEach(async () => {
            // Arrange : Étant donné que je n'ai pas de produits dans mon panier
            orderRepository = new InMemoryOrderRepository();
        })

        test("Quand j'ajoute un produit avec le SKU « ABC123 » avec la quantité 1, Alors le panier contient le produit avec le SKU « ABC123 » × 1", async () => {

            // Act : Quand j'ajoute un produit avec le SKU « ABC123 » avec la quantité 1
            const addItemToOrderUseCase = new AddItemToOrderUseCase(orderRepository);
            const addItemToOrderCommand = { sku: "ABC123", quantity: 1};
            await addItemToOrderUseCase.execute(addItemToOrderCommand);

            // Assert : Alors le panier contient le produit avec le SKU « ABC123 » × 1
            const order = orderRepository.lastSaved;
            expect(order?.items).toEqual([{ sku: 'ABC123', quantity: 1 }]);
        })



    });

    
});
