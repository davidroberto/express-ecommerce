import AppDataSource from "../../../config/db.config";
import {Product} from "../productEntity";
import {UpdateProductRepository} from "./updateProductRepository";
import {Repository} from "typeorm";

export class UpdateProductTypeOrmRepository implements UpdateProductRepository {

    private productRepository: Repository<Product>

    constructor() {
        this.productRepository = AppDataSource.getRepository(Product);
    }

    async findOneById(productId: number): Promise<Product | null> {
        return await this.productRepository.findOneBy({id: productId});
    }

    async save(product: Product): Promise<void> {
        await this.productRepository.save(product);
    }

}