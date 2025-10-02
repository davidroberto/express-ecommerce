import {CreateProductUsecase} from "./createProduct.usecase";
const express = require("express");
const router = express.Router();

import {Request, Response} from "express";

router.post('/product', async (req: Request, res: Response) => {

    const {title, description, price} = req.body;

    if (!title || !description || !price) {
        return res.status(400).json({message: "Missing required fields"});
    }

    const createProductUseCase = new CreateProductUsecase();

    try {
        createProductUseCase.execute({title, description, price});
    } catch (error: any) {
        return res.status(400).json({message: error.message});
    }

});




module.exports = router;