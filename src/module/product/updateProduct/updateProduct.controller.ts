import {UpdateProductUsecase} from "./updateProduct.usecase";

const express = require("express");
const router = express.Router();

import {Request, Response} from "express";

router.put('/product/:productId', async (req: Request, res: Response) => {

    const {title, description, price} = req.body;

    const {productId} = req.params;

    if (!title || !description || !price) {
        return res.status(400).json({message: "Missing required fields"});
    }

    const updateProductUseCase = new UpdateProductUsecase();

    try {
        await updateProductUseCase.execute({title, description, price}, parseInt(productId));
        return res.status(201);

    } catch (error: any) {
        return res.status(400).json({message: error.message});
    }

});




module.exports = router;