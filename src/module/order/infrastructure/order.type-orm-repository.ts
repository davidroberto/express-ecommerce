import OrderRepositoryInterface from "../domain/order.repository.interface";
import AppDataSource from "../../../config/db.config";
import {Order} from "../domain/order.entity";
import {Repository} from "typeorm";

export default class OrderTypeOrmRepository implements OrderRepositoryInterface {

    private readonly orderRepositoryTypeOrmBase: Repository<Order>;

    constructor() {
        this.orderRepositoryTypeOrmBase = AppDataSource.getRepository<Order>(Order);
    }

    async findOneById(id: number): Promise<Order> {
        return await this.orderRepositoryTypeOrmBase.findOneBy({id});
    }

    async save(order: Order): Promise<Order> {
        return await this.orderRepositoryTypeOrmBase.save(order);
    }


}