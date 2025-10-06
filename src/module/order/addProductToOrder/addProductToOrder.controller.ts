import {AddProductToOrderUsecase} from "./addProductToOrder.usecase";
const express = require("express");
const router = express.Router();

import {Request, Response} from "express";
import AppDataSource from "../../../config/db.config";
import {Order} from "../Order";
import {Product} from "../../product/Product";
import {OrderRepositoryTypeORM} from "../orderRepository.typeorm";

router.post('/orders/:orderId/products', async (req: Request, res: Response) => {

    const orderId = parseInt(req.params.orderId);
    const {productId, quantity} = req.body;

    if (!productId) {
        return res.status(400).json({message: "Missing required fields"});
    }

    const orderRepository = new OrderRepositoryTypeORM();
    const productRepository = AppDataSource.getRepository<Product>(Product);
    const addProductToOrderUsecase = new AddProductToOrderUsecase(orderRepository, productRepository);

    try {
        await addProductToOrderUsecase.execute({orderId, productId, quantity});

        // Récupérer la commande mise à jour pour renvoyer les détails
        const order = await orderRepository.findById(orderId);

        return res.status(200).json({
            message: order?.orderItems.find(item => item.productId === productId && item.quantity > (quantity || 1))
                ? "Quantité du produit incrémentée"
                : "Produit ajouté à la commande",
            order: {
                id: order?.id,
                totalAmount: order?.totalAmount(),
                itemCount: order?.distinctProductCount()
            }
        });

    } catch (error: any) {
        // Déterminer le code d'erreur approprié
        if (error.message === "commande non trouvée" || error.message === "produit non trouvé") {
            return res.status(404).json({message: error.message});
        }
        return res.status(400).json({message: error.message});
    }

});

module.exports = router;
