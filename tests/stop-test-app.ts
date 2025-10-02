import {jest} from "@jest/globals";
import {PostgreSqlContainer} from "@testcontainers/postgresql";
import AppDataSource from "../src/config/db.config";

export const stopTestApp = async (postgresContainer: PostgreSqlContainer) => {
    await AppDataSource.destroy();
    await postgresContainer.stop();
}