import AppDataSource from "../../../config/db.config";
import {Product} from "../productEntity";

export class UpdateProductUseCase {

    async execute(id: number, {price, description, title}: {title: string; description: string; price: number}): Promise<void>{

        const productRepository = AppDataSource.getRepository<Product>(Product);
        const product = await productRepository.findOneBy({id});


        if (title.length <= 2) {
            throw new Error("titre trop court");
        }

        if (price < 0) {
            throw new Error("le prix doit être supérieur à 0");
        }

        if (price > 10000) {
            throw new Error("le prix doit être inférieur à 10000")
        }

        product.title = title;
        product.description = description;
        product.price = price;

        await productRepository.save(product);
    }


}