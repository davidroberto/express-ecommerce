import {describe, expect, test} from "@jest/globals";
import {UpdateProductUsecase} from "../updateProductUseCase";
import {UpdateProductRepository} from "../updateProductRepository";
import {Product} from "../../Product";


class UpdateProductRepositoryMock implements UpdateProductRepository {

    findOneById(id: number): Promise<Product | null> {
        const product = new Product({"title": "switch", "description": "console de jeu", "price": 3000});
        product.id = 2;
        return product;
    }

    save(product: Product): Promise<void> {
        return product;
    }

}


describe("US-1 : Modifier un produit",  () => {

    test("Scénario 1 : modification réussie", async () => {

        //Étant donné qu’un produit existe avec l’identifiant 2
        const updateProductRepositoryMock = new UpdateProductRepositoryMock();
        const updateProductUseCase = new UpdateProductUsecase(updateProductRepositoryMock);

        // Quand je modifie le produit avec l’identifiant 2, avec en titre "switch 3», description «nouvelle nouvelle console» et un prix à 5000e
        const updatedProduct: Product = await updateProductUseCase.execute({
            id: 2,
            title: "switch 3",
            description: "nouvelle nouvelle console",
            price: 5000
        });

        // Alors le produit doit être modifié
        expect(updatedProduct.title).toBe("switch 3");
        expect(updatedProduct.description).toBe("nouvelle nouvelle console");
        expect(updatedProduct.price).toBe(5000);
    });

    test('Scénario 2 : titre trop court', async () => {

        //Étant donné qu’un produit existe avec l’identifiant 2
        const updateProductRepositoryMock = new UpdateProductRepositoryMock();
        const updateProductUseCase = new UpdateProductUsecase(updateProductRepositoryMock);

        // Quand je modifie le produit avec l’identifiant 2 avec en titre "sw»
        await expect(updateProductUseCase.execute({
            id: 2,
            title: "sw",
            description: "nouvelle nouvelle console",
            price: 5000
        // Alors une erreur doit être envoyée «titre trop courr»
        })).rejects.toThrow("titre trop court");

    })

    test('Scénario 3 : prix inférieur à 0', async () => {
      //Étant donné qu’un produit existe avec l’identifiant 2
        const updateProductRepositoryMock = new UpdateProductRepositoryMock();
        const updateProductUseCase = new UpdateProductUsecase(updateProductRepositoryMock);

        await expect(updateProductUseCase.execute({
            id: 2,
            title: "switch 3",
            description: "nouvelle nouvelle console",
            price: -10
        // Alors une erreur doit être envoyée "le prix doit être supérieur à 0»
        })).rejects.toThrow("le prix doit être supérieur à 0");

    })


});