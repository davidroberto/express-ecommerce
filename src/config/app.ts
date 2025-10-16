import express, {Request, Response} from "express";
const cors = require("cors");
const productController = require("../module/product/createProduct/createProductController");



export function buildApp() {
    const app = express();
    app.use(cors());
    app.use(express.json());

    app.get('/api/health', (req: Request, res: Response)=> {
        res.send('OK');
    });

    app.use("/api", productController);

    return app;
}
