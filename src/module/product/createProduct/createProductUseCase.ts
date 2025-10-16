import AppDataSource from "../../../config/db.config";
import {Product} from "../productEntity";

export class CreateProductUseCase {

    async execute({title, description, price}: {title: string, description: string, price: number}): Promise<void> {

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