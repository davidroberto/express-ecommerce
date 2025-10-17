import {describe, expect, test} from "@jest/globals";
import {CreateProductUseCase} from "../createProductUseCase";
import {CreateProductRepository} from "../createProductRepository";
import {Product} from "../../productEntity";


class CreateProductDummyRepository implements CreateProductRepository {

    async save(product: Product): Promise<void> {
        // Ne fait rien, c'est un dummy
    }

}

describe("US-1 : Créer un produit",  () => {

    test("Scénario 1 : création réussie", async () => {

        // Étant donné qu'il n'y a pas de produit enregistré
        const createProductRepository = new CreateProductDummyRepository();
        const createProductUseCase = new CreateProductUseCase(createProductRepository);

        await expect(
            // Quand je créé un produit avec en titre «switch 2», description «nouvelle console» et un prix à 500
            createProductUseCase.execute({title: "switch 2", description: "nouvelle console", price: 500})
            // Alors le produit doit être créé
        ).resolves.not.toThrow();

    });

    test('Scénario 2 : echec, titre trop court', async () => {

        //Étant donné qu'il n'y a pas de produit enregistré
        const createProductRepository = new CreateProductDummyRepository();
        const createProductUseCase = new CreateProductUseCase(createProductRepository);

        await expect(
            // Quand je créé un produit avec en titre «sw»
            createProductUseCase.execute({title: "sw", description: "nouvelle console", price: 500})
        // Alors une erreur doit être envoyée "titre trop court»
        ).rejects.toThrow("titre trop court");
    });

});