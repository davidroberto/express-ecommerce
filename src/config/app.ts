import express, {Request, Response} from "express";
const cors = require("cors");
const orderController = require('../module/order/ui/order.controller');

export function buildApp() {
    const app = express();
    app.use(cors());
    app.use(express.json());

    app.get('/api/health', (req: Request, res: Response)=> {
        res.send('OK');
    });
    app.use("/api/order", orderController);

    return app;
}
