import AppDataSource from "../../../config/db.config";
import {Product} from "../Product";

export class UpdateProductUsecase {

    async execute({title, description, price}: any,productId: number) {

        const productRepositoryTypeOrm = AppDataSource.getRepository<Product>(Product);

        const product = await productRepositoryTypeOrm.findOneBy({id: productId});

        if (!product) {
            throw new Error("Product not found");
        }

        product.update(title, description, price);


        try {
            await productRepositoryTypeOrm.save(product);
        } catch (error) {
            throw new Error('Error updating product');
        }

    }

}