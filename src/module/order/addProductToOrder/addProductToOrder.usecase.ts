import {OrderRepository} from "../orderRepository.interface";
import {ProductRepository} from "../../product/productRepository.interface";

type AddProductToOrderDTO = {
    orderId: number;
    productId: number;
    quantity?: number;
}

export class AddProductToOrderUsecase {

    private readonly orderRepository: OrderRepository;
    private readonly productRepository: ProductRepository;

    constructor(orderRepository: OrderRepository, productRepository: ProductRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
    }

    async execute({orderId, productId, quantity}: AddProductToOrderDTO): Promise<void> {
        // Charger la commande
        const order = await this.orderRepository.findById(orderId);
        if (!order) {
            throw new Error("commande non trouvée");
        }

        // Charger le produit
        const product = await this.productRepository.findById(productId);
        if (!product) {
            throw new Error("produit non trouvé");
        }

        // Ajouter le produit à la commande (quantité par défaut: 1)
        const qty = quantity || 1;
        order.addProduct(product, qty);

        // Sauvegarder la commande
        await this.orderRepository.save(order);
    }
}
