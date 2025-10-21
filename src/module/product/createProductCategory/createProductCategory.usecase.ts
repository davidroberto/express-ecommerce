import {Category} from "../Category";
import {ProductCategoryRepository} from "../productCategoryRepository.interface";

export class CreateProductCategoryUsecase {

    constructor(private readonly productCategoryRepository: ProductCategoryRepository) {}

    async execute(title: string, description: string, color: string) {
        const category = new Category(title, description, color);

        await this.productCategoryRepository.save(category);

        return category;
    }

}