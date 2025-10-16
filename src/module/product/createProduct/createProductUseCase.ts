import AppDataSource from "../../../config/db.config";
import {Product} from "../productEntity";

export class CreateProductUseCase {

    async execute({title, description, price}: {title: string, description: string, price: number}): Promise<void> {

        if (title.length <= 2) {
            throw new Error("titre trop court");
        }

        if (price < 0) {
            throw new Error("le prix doit être supérieur à 0");
        }

        if (price > 10000) {
            throw new Error("le prix doit être inférieur à 10000");
        }

        const productRepository = AppDataSource.getRepository<Product>(Product);

        const product = new Product();
        product.title = title;
        product.description = description;
        product.price = price;

        try {
            await productRepository.save(product);
        } catch (error) {
            console.error("Error saving product:", error);
        }

    }

}