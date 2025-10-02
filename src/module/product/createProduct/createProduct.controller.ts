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

    return createProductUseCase.execute({title, description, price}, res);

});




module.exports = router;