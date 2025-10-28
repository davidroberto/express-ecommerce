import {AddProductToOrderRepository} from "./addProductToOrderRepository";
import {Order} from "../Order";

export class AddProductToOrderUseCase {

    private orderRepository: AddProductToOrderRepository;

    constructor(orderRepository: AddProductToOrderRepository) {
        this.orderRepository = orderRepository;
    }

    async execute({orderId, productId, quantity}: {orderId: number, productId: number, quantity: number}): Promise<void> {

        const order = await this.orderRepository.findById(orderId);

        order.addProduct(productId, quantity);

        await this.orderRepository.save(order);

    }

}
