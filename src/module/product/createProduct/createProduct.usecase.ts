import AppDataSource from "../../../config/db.config";
import {Product} from "../Product";
import {ProductRepository} from "../productRepository.interface";

type CreateProductDTO = {
    price: number;
    title: string;
    description: string;
}

export class CreateProductUsecase {

    private readonly productRepository: ProductRepository;

    // je reçois en paramètre une implémentation de ProductRepository (type orm ou pas)
    // et je l'affecte à une propriété de la classe
    // c'est l'inversion de dépendance (le use case ne choisit pas le repository utilisé
    constructor( productRepository: ProductRepository) {
        this.productRepository = productRepository;
    }

     async execute ({price, title, description}: CreateProductDTO) {

        if (price <= 0) {
            throw new Error("price must be greater than 0");
        }

        if (price > 10000) {
            throw new Error("price must be less than 10000");
        }

        if (title.length < 2) {
            throw new Error("title must be at least 2 characters");
        }

        try {
            // j'utilise le repository pour sauvegarder le produit
            await this.productRepository.save({title, description, price});
        } catch (error) {
            throw new Error('Error saving product');
        }

    }

}