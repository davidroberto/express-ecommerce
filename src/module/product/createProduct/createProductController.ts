import {Product} from "../productEntity";

const express = require("express");
const router = express.Router();
import AppDataSource from "../../../config/db.config";


import {Request, Response} from "express";
import {CreateProductUseCase} from "./createProductUseCase";

router.post('/product', async (request: Request, response: Response) => {

    const {title, description, price} = request.body;

    const createProductUseCase = new CreateProductUseCase();
    await createProductUseCase.execute({title, description, price});

    return response.status(201).json();
});




module.exports = router;