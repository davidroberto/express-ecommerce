import AppDataSource from "../../../config/db.config";
import {Product} from "../Product";

type CreateProductDTO = {
    price: number;
    title: string;
    description: string;
}

export class CreateProductUsecase {

     async execute ({price, title, description}: CreateProductDTO) {

        if (price <= 0) {
            throw new Error("price must be greater than 0");
        }

        if (price > 10000) {
            throw new Error("price must be less than 10000");
        }

        const productRepositoryTypeOrm = AppDataSource.getRepository<Product>(Product);

        try {
            await productRepositoryTypeOrm.save({title, description, price});
        } catch (error) {
            throw new Error('Error saving product');
        }

    }

}