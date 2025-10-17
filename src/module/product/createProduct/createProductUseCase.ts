import {Product} from "../productEntity";
import {CreateProductRepository} from "./createProductRepository";

export class CreateProductUseCase {

    private productRepository: CreateProductRepository;

    constructor(productRepository: CreateProductRepository) {
        this.productRepository = productRepository;
    }

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

        const product = new Product();
        product.title = title;
        product.description = description;
        product.price = price;

        try {
            await this.productRepository.save(product);
        } catch (error) {
            console.error("Error saving product:", error);
        }

    }

}