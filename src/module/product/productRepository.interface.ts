import {Product} from "./Product";

export interface ProductRepository {
    save(product: Product): Promise<void>;
    findOneBy(criteria: Partial<Product>): Promise<Product | null>;
}