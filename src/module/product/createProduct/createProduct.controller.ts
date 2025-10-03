import {CreateProductUsecase} from "./createProduct.usecase";
const express = require("express");
const router = express.Router();

import {Request, Response} from "express";
import AppDataSource from "../../../config/db.config";
import {Product} from "../Product";

router.post('/product', async (req: Request, res: Response) => {

    const {title, description, price} = req.body;

    if (!title || !description || !price) {
        return res.status(400).json({message: "Missing required fields"});
    }

    // je récupère le repository TypeORM
    const productRepository = AppDataSource.getRepository<Product>(Product);
    // j'instancie le use case
    // et je lui injecte le repository type orm
    const createProductUseCase = new CreateProductUsecase(productRepository);

    try {
        await createProductUseCase.execute({title, description, price});
        return res.status(201);

    } catch (error: any) {
        return res.status(400).json({message: error.message});
    }

});




module.exports = router;