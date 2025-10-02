import {afterAll, afterEach, beforeAll, beforeEach, describe, expect, jest, test} from "@jest/globals";
import { PostgreSqlContainer } from "@testcontainers/postgresql";
import request from "supertest";
import {createTestApp} from "../create-test-app";
import {stopTestApp} from "../stop-test-app";
import {AddItemToOrderUseCase} from "../../src/module/order/application/add-item-to-order.use-case";

describe("US-1 : Cumuler les quantités pour un même article dans le panier",  () => {

    let postgresContainer: any;
    let app: any;
    let dataSource: any;

    beforeEach(async () => {
        const testApp = await createTestApp();
        app = testApp.app;
        postgresContainer = testApp.postgresContainer;
    });

    afterEach(async () => {
        await stopTestApp(postgresContainer);
    });

    describe("AC-1", () => {

        test("Quand j'ajoute un produit avec le SKU « ABC123 » avec la quantité 1, Alors le panier contient le produit avec le SKU « ABC123 » × 1", async () => {

            // Act : Quand j'ajoute un produit avec le SKU « ABC123 » avec la quantité 1
            const addItemToOrderCommand = { sku: "ABC123", quantity: 1 };
            const addItemToOrderResponse = await request(app)
                .post("/api/order")
                .send(addItemToOrderCommand)
                .set("Accept", "application/json");

            // Assert : Alors le panier contient le produit avec le SKU « ABC123 » × 1
            expect(addItemToOrderResponse.body.items).toHaveLength(1);
            expect(addItemToOrderResponse.body.items[0].sku).toEqual("ABC123");
            expect(addItemToOrderResponse.body.items[0].quantity).toEqual(1);
            expect(addItemToOrderResponse).not.toBeNull();
        })

    });

});