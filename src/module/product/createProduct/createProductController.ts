import {CreateProductTypeOrmRepository} from "./createProductTypeOrmRepository";

const express = require("express");
const router = express.Router();
import {Request, Response} from "express";
import {CreateProductUseCase} from "./createProductUseCase";

router.post('/product', async (request: Request, response: Response) => {

    const {title, description, price} = request.body;

    const createProductTypeOrmRepository = new CreateProductTypeOrmRepository();
    const createProductUseCase = new CreateProductUseCase(createProductTypeOrmRepository);

    try {
        await createProductUseCase.execute({title, description, price});
    } catch (error) {
        if (error instanceof Error) {
            return response.status(400).json({message: error.message});
        }

        return response.status(500).json({message: "Internal server error"});

    }

    return response.status(201).json();
});




module.exports = router;