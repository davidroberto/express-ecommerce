import {describe, expect, test} from "@jest/globals";
import {CreateProductCategoryUsecase} from "./createProductCategory.usecase";
import {Category} from "../Category";
import {ProductCategoryRepository} from "../productCategoryRepository.interface";


class ProductCategoryMockRepository implements  ProductCategoryRepository {

    async save(category: Category): Promise<void> {
        // dummy, do nothing
    }
}

describe("US-1 : Créer une catégorie",  () => {


    test("Scénario 1: création réussie", async () => {

        const productCategoryRepository = new ProductCategoryMockRepository();
        const createProductCategoryUseCase = new CreateProductCategoryUsecase(productCategoryRepository);

        const category = await createProductCategoryUseCase.execute("Electronics", "Category for electronic products", "red");

        expect(category.title).toBe("Electronics");
        expect(category.description).toBe("Category for electronic products");
        expect(category.color).toBe("red");

    });

    test("Scénario 2: création échouée, mauvaise couleur", async () => {

        const productCategoryRepository = new ProductCategoryMockRepository();
        const createProductCategoryUseCase = new CreateProductCategoryUsecase(productCategoryRepository);

        await expect(createProductCategoryUseCase.execute(
            "Electronics",
            "Category for electronic products",
            "purple"
        )).rejects.toThrow("Invalid color. Allowed colors are: red, blue, green, yellow");



    });



});
