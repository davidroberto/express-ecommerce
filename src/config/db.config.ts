import { config } from 'dotenv';
import {DataSource} from "typeorm";
import {Product} from "../module/product/Product";
import {Order} from "../module/order/Order";
import {OrderItem} from "../module/order/OrderItem";
config({ path: '.env.local' });

const AppDataSource =  new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PW,
    database: process.env.DB_NAME,
    logging: false,
    entities: [Product, Order, OrderItem],
    synchronize: true,
    entitySkipConstructor: true,
});


export default AppDataSource;