const express = require("express");
const router = express.Router();

import {Request, Response} from "express";
import OrderTypeOrmRepository from "../infrastructure/order.type-orm-repository";
import {AddItemToOrderUseCase} from "../application/add-item-to-order.use-case";

// POST /api/order
router.post('/', async (req: Request, res: Response) => {

    // {sku, qty, orderId?}
    const addItemTOrderCommand = req.body;


    const orderRepositoryTypeOrm = new OrderTypeOrmRepository();
    const createInvoiceUseCase = new AddItemToOrderUseCase(orderRepositoryTypeOrm);

    try {
        const order = await createInvoiceUseCase.execute(addItemTOrderCommand);

        res.status(201);
        return res.json(order);

    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "An error occurred";
        return res.status(400).json({message});
    }
});




module.exports = router;