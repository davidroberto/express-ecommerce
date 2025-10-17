import {Product} from "../productEntity";

export interface CreateProductRepository {
    save(product: Product): Promise<void>;
}