import {Product} from "./Product";

export interface ProductRepository {
    save(product: {price: number; title: string; description: string}): Promise<void>;
    findById(id: number): Promise<Product | null>;
}