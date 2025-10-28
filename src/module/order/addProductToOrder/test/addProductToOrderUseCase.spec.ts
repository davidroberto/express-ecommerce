import {describe, expect, test} from "@jest/globals";
import {AddProductToOrderUseCase} from "../addProductToOrderUseCase";
import {AddProductToOrderRepository} from "../addProductToOrderRepository";
import {Order} from "../../Order";


class AddProductToOrderDummyRepository implements AddProductToOrderRepository {

    async findById(orderId: number): Promise<Order | null> {
        // Retourne une commande vide qui n'a pas le produit ID 2
        const order = new Order({id: 1, items: [], totalAmount: 0});
        return order;
    }

    async save(order: Order): Promise<void> {
        // Ne fait rien, c'est un dummy
    }

}


describe("US-2 : Ajouter un produit à une commande", () => {

    test("Scénario US-2-1 : ajout réussi, produit n'existe pas dans la commande", async () => {

        // Étant donné qu'une commande existe avec l'identifiant 1 et qu'elle ne contient pas le produit avec l'identifiant 2
        const addProductToOrderRepository = new AddProductToOrderDummyRepository();
        const addProductToOrderUseCase = new AddProductToOrderUseCase(addProductToOrderRepository);

        await expect(
            // Quand j'ajoute le produit avec l'identifiant 2 à la commande avec l'identifiant 1 avec une quantité de 1
            addProductToOrderUseCase.execute({orderId: 1, productId: 2, quantity: 1})
        // Alors le produit avec l'identifiant 2 doit être ajouté à la commande avec une quantité de 1
        ).resolves.not.toThrow();

    });

});
