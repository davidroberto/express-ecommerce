import {UpdateProductUseCase} from "./updateProductUseCase";
const express = require("express");
const router = express.Router();
import {Request, Response} from "express";

router.post('/product/:id', async (request: Request, response: Response) => {

    const id = parseInt(request.params.id);
    const {title, description, price} = request.body;

    const updateProductUseCase = new UpdateProductUseCase();

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