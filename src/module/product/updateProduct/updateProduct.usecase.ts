import AppDataSource from "../../../config/db.config";
import {Product} from "../Product";

export class UpdateProductUsecase {

    async execute({title, description, price}: any,productId: number) {

        if (title.length < 2) {
            throw new Error("Title must be at least 2 characters long");
        }

        if (price <= 0) {
            throw new Error("Price must be greater than 0");
        }

        if (price > 10000) {
            throw new Error("Price must be less than 10000");
        }

        const productRepositoryTypeOrm = AppDataSource.getRepository<Product>(Product);

        const product = await productRepositoryTypeOrm.findOneBy({id: productId});

        if (!product) {
            throw new Error("Product not found");
        }

        product.title = title;
        product.description = description;
        product.price = price;

        try {
            await productRepositoryTypeOrm.save(product);
        } catch (error) {
            throw new Error('Error updating product');
        }

    }

}