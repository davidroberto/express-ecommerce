import express, {Request, Response} from "express";
const cors = require("cors");
const productController = require("../module/product/createProduct/createProduct.controller");
const orderController = require("../module/order/addProductToOrder/addProductToOrder.controller");


export function buildApp() {
    const app = express();
    app.use(cors());
    app.use(express.json());

    app.get('/api/health', (req: Request, res: Response)=> {
        res.send('OK');
    });

    app.use("/api", productController);
    app.use("/api", orderController);

    return app;
}
