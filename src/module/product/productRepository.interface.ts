import {Product} from "./Product";

export interface ProductRepository {
    save(product: Product): Promise<void>;
}