import {Category} from "./Category";

export interface ProductCategoryRepository {
    save(category: Category): Promise<void>;
}