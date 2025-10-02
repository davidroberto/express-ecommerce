import AppDataSource from "../../../config/db.config";
import {Product} from "../Product";

export class CreateProductUsecase {

     async execute ({price, title, description}) {

        if (price <= 0) {
            return res.status(400).json({message: "Price must be greater than zero"});
        }

        if (price > 10000) {
            return res.status(400).json({message: "Price must be less than 10,000"});
        }

        const productRepositoryTypeOrm = AppDataSource.getRepository<Product>(Product);

        try {
            await productRepositoryTypeOrm.save({title, description, price});

            return res.status(201).json({message: "Product created successfully"});
        } catch (error) {
            return res.status(500).json({message: "Internal server error"});
        }

    }

}