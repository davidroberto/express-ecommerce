import { afterAll, beforeAll, describe, expect, jest, test } from "@jest/globals";
import { PostgreSqlContainer } from "@testcontainers/postgresql";
import request from "supertest";
import {createTestApp} from "./create-test-app";
import {stopTestApp} from "./stop-test-app";

describe("Health Check API", () => {

    let postgresContainer: any;
    let app: any;
    let dataSource: any;


    // ARRANGE
    // GIVEN
    beforeAll(async () => {
        const testApp = await createTestApp();
        app = testApp.app;
        postgresContainer = testApp.postgresContainer;
        dataSource = testApp.dataSource;

    });

    afterAll(async () => {
        await stopTestApp(postgresContainer, dataSource);
    });

    test("GET /api/health should return status 200", async () => {

        // ACT
        // WHEN
        const response = await request(app).get("/api/health");


        // ASSERT
        // THEN
        expect(response.status).toBe(200);
    });
});

// AAA