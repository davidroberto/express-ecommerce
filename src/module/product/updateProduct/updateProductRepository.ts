import {Product} from "../productEntity";

export interface UpdateProductRepository {
    findOneById(id: number): Promise<Product | null>;
    save(product: Product): Promise<void>;
}