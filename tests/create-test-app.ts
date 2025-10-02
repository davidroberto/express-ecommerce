import { PostgreSqlContainer } from "@testcontainers/postgresql";
import { buildApp } from "../src/config/app";
import { DataSource } from "typeorm";
import createTypeOrmDataSource from "../src/config/db.config";
import AppDataSource from "../src/config/db.config";


export async function createTestApp() {
    const postgresContainer = await new PostgreSqlContainer("postgres:14").start();
    const connectionUrl = new URL(postgresContainer.getConnectionUri());

    // Remplacer les variables d'environnement pour la durée du test
    process.env.DB_HOST = connectionUrl.hostname;
    process.env.DB_PORT = connectionUrl.port;
    process.env.DB_USER = connectionUrl.username;
    process.env.DB_PW = connectionUrl.password;
    process.env.DB_NAME = connectionUrl.pathname.substring(1);

    await AppDataSource.initialize();

    const app = buildApp();

    return { app, postgresContainer };
}