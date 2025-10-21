import {Product} from "../productEntity";
import {CreateProductRepository} from "./createProductRepository";

export class CreateProductUseCase {

    private productRepository: CreateProductRepository;

    constructor(productRepository: CreateProductRepository) {
        this.productRepository = productRepository;
    }

    async execute({title, description, price}: {title: string, description: string, price: number}): Promise<void> {

        const product = new Product(price, title, description);

        try {
            await this.productRepository.save(product);
        } catch (error) {
            throw new Error("erreur lors de la création du produit");
        }

    }

}