export interface ProductRepository {
    save(product: {price: number; title: string; description: string}): Promise<void>;
}