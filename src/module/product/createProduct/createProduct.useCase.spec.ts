import {describe, expect, test} from "@jest/globals";
import {CreateProductUsecase} from "./createProduct.usecase";


describe("US-1 : Créer un produit",  () => {


    test("Scénario 1: création réussie", async () => {

        // Étant donné je suis identifié en tant qu’admin et qu'il n'y a pas de produit enregistré
        //???

        // Quand je créé un produit avec en titre «switch 2», description «nouvelle console» et un prix à 500

        const createProductUseCase = new CreateProductUsecase();
        await createProductUseCase.execute({title: "switch 2", description: "nouvelle console", price: 500});

        // Alors le produit doit être créé

        // aller chercher dans la BDD ?

    })



});
