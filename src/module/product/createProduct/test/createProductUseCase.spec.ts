import {describe, expect, test} from "@jest/globals";
import {CreateProductUseCase} from "../createProductUseCase";

describe("US-1 : Créer un produit",  () => {

    test("Scénario 1 : création réussie", async () => {

        // Étant donné qu'il n'y a pas de produit enregistré
        const createProductUseCase = new CreateProductUseCase();

        await expect(
            // Quand je créé un produit avec en titre «switch 2», description «nouvelle console» et un prix à 500
            createProductUseCase.execute({title: "switch 2", description: "nouvelle console", price: 500})
            // Alors le produit doit être créé
        ).resolves.not.toThrow();

    });

});