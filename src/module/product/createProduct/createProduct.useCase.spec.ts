import {describe, expect, test} from "@jest/globals";
import {CreateProductUsecase} from "./createProduct.usecase";
import {ProductRepository} from "../productRepository.interface";


class DummyProductRepository implements ProductRepository {

    async save(product: { price: number; title: string; description: string; }): Promise<void> {
        // Ne fait rien, juste pour les tests
    }

}

describe("US-1 : Créer un produit",  () => {


    test("Scénario 1: création réussie", async () => {

        // Étant qu'il n'y a pas de produit enregistré
        const dummyProductRepository = new DummyProductRepository();
        const createProductUseCase = new CreateProductUsecase(dummyProductRepository);

        await expect(
            // Quand je créé un produit avec en titre «switch 2», description «nouvelle console» et un prix à 500
            createProductUseCase.execute({title: "switch 2", description: "nouvelle console", price: 500})
        // Alors le produit doit être créé
        ).resolves.not.toThrow();

    });

    test("Scénario 2: création échouée - titre trop court", async () => {
        // Étant donné qu'il n'y a pas de produit enregistré
        const dummyProductRepository = new DummyProductRepository();

        const createProductUseCase = new CreateProductUsecase(dummyProductRepository);

        await expect(
        // Quand je créé un produit avec en titre «sw»
            createProductUseCase.execute({title: "sw", description: "nouvelle console", price: 500})
        // Alors une erreur doit être envoyée "titre trop court»
        ).rejects.toThrow("titre trop court");


    });

    test("Scénario 3 : création échouée, prix négatif", async () => {
        //Étant donné qu'il n'y a pas de produit enregistré
        const dummyProductRepository = new DummyProductRepository();

        const createProductUseCase = new CreateProductUsecase(dummyProductRepository);
        // Quand je créé un produit avec en prix -10
        await expect(
            createProductUseCase.execute({title: "switch", description: "nouvelle console", price: -10})
        // Alors une erreur doit être envoyée «le prix doit être supérieur à 0»
        ).rejects.toThrow("le prix doit être supérieur à 0");

    })



    test("Scénario 4: création échouée, prix supérieur à 10000", async () => {

        //Étant donné qu'il n'y a pas de produit enregistré
        const dummyProductRepository = new DummyProductRepository();

        const createProductUseCase = new CreateProductUsecase(dummyProductRepository);
        await expect(
            // Quand je créé un produit avec en prix 11000
            createProductUseCase.execute({title: "switch", description: "nouvelle console", price: 11000})
        // Alors une erreur doit être envoyée «le prix doit être inférieur à 11000»
        ).rejects.toThrow("le prix doit être inférieur à 10000");

    });
});
