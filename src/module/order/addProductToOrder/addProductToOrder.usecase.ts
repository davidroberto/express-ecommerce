import {Order} from "../Order";
import {OrderProduct} from "../OrderProduct";
import {ProductRepository} from "../../product/productRepository.interface";
import {OrderRepository} from "../orderRepository.interface";

export class AddProductToOrderUseCase {

    private readonly productRepository: ProductRepository;

    private readonly orderRepository: OrderRepository;

    constructor( productRepository: ProductRepository, orderRepository: OrderRepository) {
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
    }

    async execute(productId: number, quantity: number): Promise<Order> {

        const product = await this.productRepository.findOneBy({id: productId});

        let order = await this.orderRepository.findLast();

        if (!order) {
            order = new Order();

            const orderProduct = new OrderProduct();

            orderProduct.productId = productId;
            orderProduct.quantity = quantity;

            order.orderProducts.push(orderProduct);

            order.totalPrice = product.price * quantity;

            return order;
        }

        const orderProduct = order.orderProducts.find(op => op.productId === productId);

        if (orderProduct) {
            orderProduct.quantity += quantity;
        }

        order.totalPrice += product.price * quantity;

        return order;
    }
}