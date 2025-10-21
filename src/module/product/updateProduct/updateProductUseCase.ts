import {UpdateProductRepository} from "./updateProductRepository";

export class UpdateProductUsecase {

    private productRepository: UpdateProductRepository;

    constructor(productRepository: UpdateProductRepository) {
        this.productRepository = productRepository;
    }


    async execute({title, description, price}: any,productId: number) {

        const product = await this.productRepository.findOneById(productId);

        if (!product) {
            throw new Error("Product not found");
        }

        product.update(title, description, price);


        try {
            await this.productRepository.save(product);
        } catch (error) {
            throw new Error('Error updating product');
        }

    }

}