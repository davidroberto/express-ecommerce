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

    test("Scénario US-2-2 : ajout réussi, produit existe déjà dans la commande", async () => {
        // GIVEN: Étant donné qu'une commande existe avec l'identifiant 1 et qu'elle contient déjà le produit avec l'identifiant 2 avec une quantité de 2
        class AddProductToOrderDummyRepositoryWithExistingProduct implements AddProductToOrderRepository {
            public savedOrder: Order | null = null;

            async findById(orderId: number): Promise<Order | null> {
                // Retourne une commande qui contient déjà le produit ID 2 avec quantité 2
                const order = new Order({
                    id: 1,
                    items: [{productId: 2, quantity: 2}],
                    totalAmount: 0
                });
                return order;
            }

            async save(order: Order): Promise<void> {
                // Capture l'ordre sauvegardé pour vérification
                this.savedOrder = order;
            }
        }

        const repository = new AddProductToOrderDummyRepositoryWithExistingProduct();
        const addProductToOrderUseCase = new AddProductToOrderUseCase(repository);

        // WHEN: Quand j'ajoute le produit avec l'identifiant 2 à la commande avec l'identifiant 1 avec une quantité de 1
        await addProductToOrderUseCase.execute({orderId: 1, productId: 2, quantity: 1});

        // THEN: Alors la quantité du produit avec l'identifiant 2 dans la commande doit être mise à jour à 3
        expect(repository.savedOrder).not.toBeNull();
        const productItem = repository.savedOrder!.items.find(item => item.productId === 2);
        expect(productItem).toBeDefined();
        expect(productItem!.quantity).toBe(3);
    });

    test("Scénario US-2-3 : ajout échoué, dépassement du nombre maximum de produits", async () => {
        // GIVEN: Étant donné qu'une commande existe avec l'identifiant 1 et qu'elle contient déjà 5 produits différents
        class AddProductToOrderDummyRepositoryWithMaxProducts implements AddProductToOrderRepository {
            async findById(orderId: number): Promise<Order | null> {
                // Retourne une commande qui contient déjà 5 produits différents
                const order = new Order({
                    id: 1,
                    items: [
                        {productId: 1, quantity: 1},
                        {productId: 2, quantity: 1},
                        {productId: 3, quantity: 1},
                        {productId: 4, quantity: 1},
                        {productId: 5, quantity: 1}
                    ],
                    totalAmount: 0
                });
                return order;
            }

            async save(order: Order): Promise<void> {
                // Ne fait rien, c'est un dummy
            }
        }

        const repository = new AddProductToOrderDummyRepositoryWithMaxProducts();
        const addProductToOrderUseCase = new AddProductToOrderUseCase(repository);

        // WHEN: Quand j'ajoute un nouveau produit à la commande avec l'identifiant 1
        // THEN: Alors une erreur doit être envoyée « nombre maximum de produits atteint »
        await expect(
            addProductToOrderUseCase.execute({orderId: 1, productId: 6, quantity: 1})
        ).rejects.toThrow("nombre maximum de produits atteint");
    });

});
