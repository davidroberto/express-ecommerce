import {UpdateProductTypeOrmRepository} from "./updateProductTypeOrmRepository";

const express = require("express");
const router = express.Router();
import {Request, Response} from "express";
import {UpdateProductUsecase} from "./updateProductUseCase";

router.post('/product/:id', async (request: Request, response: Response) => {

    const id = parseInt(request.params.id);
    const {title, description, price} = request.body;

    const updateProductTypeOrmRepository = new UpdateProductTypeOrmRepository()
    const updateProductUseCase = new UpdateProductUsecase(updateProductTypeOrmRepository);

    try {
        await updateProductUseCase.execute(id, {title, description, price});
    } catch (error) {
        if (error instanceof Error) {
            return response.status(400).json({message: error.message});
        }

        return response.status(500).json({message: "Internal server error"});

    }

    return response.status(201).json();
});




module.exports = router;