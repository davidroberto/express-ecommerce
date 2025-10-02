import OrderRepositoryInterface from "../domain/order.repository.interface";
import {Order} from "../domain/order.entity";
import {InMemoryOrderRepository} from "../infrastructure/order.in-memory-repository";


type AddItemToOrderCommand = { sku: string; quantity: number; orderId?: number; };

export class AddItemToOrderUseCase {
    constructor(private readonly orderRepository: OrderRepositoryInterface) {}

    async execute(addItemToOrderCommand: AddItemToOrderCommand): Promise<Order> {


        const { orderId, sku, quantity } = addItemToOrderCommand;


        if (orderId) {
            const order = await this.orderRepository.findOneById(orderId);

            if (!order) {
                throw new Error(`Order with id ${orderId} not found`);
            }

            try {
                order.addItem(sku, quantity);

            } catch (error) {

                if (error instanceof Error) {
                    throw new Error(error.message);
                }
            }


            try {
                await this.orderRepository.save(order);
            } catch (error) {
                if (error instanceof Error) {
                    throw new Error(`Failed to save order: ${error.message}`);
                }

                throw new Error("An unknown error occurred while saving the order");
            }

            return order;
        }

        const orderToPersist = new Order(sku, quantity);

        try {
            const order = await this.orderRepository.save(orderToPersist);
            return order;
        } catch (error) {
            if (error instanceof Error) {
                console.log(`Failed to save order: ${error.message}`);
                throw new Error(`Failed to save order: ${error.message}`);
            }

            throw new Error("An unknown error occurred while saving the order");
        }



    }}