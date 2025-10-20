import AppDataSource from "../../../config/db.config";
import {Product} from "../Product";
import {ProductRepository} from "../productRepository.interface";

type CreateProductDTO = {
    price: number;
    title: string;
    description: string;
}

export class CreateProductUsecase {

    private readonly productRepository: ProductRepository;

    constructor( productRepository: ProductRepository) {
        this.productRepository = productRepository;
    }

     async execute ({price, title, description}: CreateProductDTO) {

        const product = new Product(title, description, price);

        await this.persistProduct(product);


    }


    private async persistProduct(product: Product): Promise<void> {

        try {
            await this.productRepository.save(product);
        } catch (error) {
            throw new Error('Error saving product');
        }
    }

}