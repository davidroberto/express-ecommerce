import { buildApp } from "./config/app";
import { config } from 'dotenv';
import AppDataSource from "./config/db.config";

config({ path: '.env.local' });

AppDataSource
    .initialize()
    .then(() => {

        console.log("Data Source has been initialized!")
        buildApp().listen(process.env.PORT, () => console.log('Server started'));

    })
    .catch((err: Error) => {
        console.error("Error during Data Source initialization:", err)
    });
