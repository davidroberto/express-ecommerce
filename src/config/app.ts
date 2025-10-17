import express, {Request, Response} from "express";
const cors = require("cors");
const createProductController = require("../module/product/createProduct/createProductController");
const updateProductController = require("../module/product/updateProduct/updateProductController");



export function buildApp() {
    const app = express();
    app.use(cors());
    app.use(express.json());

    app.get('/api/health', (req: Request, res: Response)=> {
        res.send('OK');
    });

    app.use("/api", createProductController);
    app.use("/api", updateProductController);


    return app;
}
