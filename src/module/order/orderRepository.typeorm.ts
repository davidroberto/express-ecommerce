import {OrderRepository} from "./orderRepository.interface";
import {Order} from "./Order";
import AppDataSource from "../../config/db.config";

export class OrderRepositoryTypeORM implements OrderRepository {

    async findById(id: number): Promise<Order | null> {
        const repository = AppDataSource.getRepository(Order);
        const order = await repository.findOne({
            where: { id },
            relations: ['orderItems']
        });
        return order;
    }

    async save(order: Order): Promise<void> {
        const repository = AppDataSource.getRepository(Order);
        await repository.save(order);
    }
}
