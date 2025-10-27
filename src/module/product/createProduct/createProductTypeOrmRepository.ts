import {CreateProductRepository} from "./createProductRepository";
import AppDataSource from "../../../config/db.config";
import {Product} from "../Product";

export class CreateProductTypeOrmRepository implements CreateProductRepository {

    async save(product: Product): Promise<void> {
        const typeOrmRepository = AppDataSource.getRepository<Product>(Product);
        await typeOrmRepository.save(product);
    }

}